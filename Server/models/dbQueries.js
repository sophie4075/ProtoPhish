const db = require('../db');
const crypt = require('bcryptjs');

exports.register = (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (error, result) => {
        if(error){
            return callback(error, null);
        }

        if(result > 0){
            return callback(null, {message: 'Can not register user, please contact the system admin'})
        }

    })
}

exports.createUser = ({name, email, password }, callback) => {
    db.get('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (error, result) => {
        if(error){
            return callback(error);
        }
        return callback(null);
    });
};

exports.login = ({email, password}, callback) => {

    db.get('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
        if(!result || !(await crypt.compare(password, result.password)) ){
            return callback(null, { success: false, message: 'E-Mail or password is incorrect, please try again.' });
        } else {
            return callback(null, {success: true, user: result});
        }
    });
}

exports.checkForUser = ({id}, callback) => {

    db.get('SELECT * FROM users WHERE id = ?', [id], async (error, result) => {

        if (!result) {
            return callback(null, { success: false });
        }

        // Benutzer wurde gefunden
        return callback(null, { success: true, user: result });

    });
}

// Abfrage für Benutzerinformationen (Punkte, Phishing-Score)
exports.getUserInfo = (userId, callback) => {
    const query = 'SELECT points, recognized_phishing_score, missed_phishing_score FROM users WHERE id = ?';
    db.get(query, [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
};

// Funktion zum Aktualisieren der Benutzerergebnisse in der Datenbank
exports.updateUserResults = (userId, score, recognizedPhishingScore, missedPhishingScore, callback) => {

    const query = `
        UPDATE users
        SET points = points + ?,
            recognized_phishing_score = recognized_phishing_score + ?,
            missed_phishing_score = missed_phishing_score + ?
        WHERE id = ?
    `;

    db.run(query, [score, recognizedPhishingScore, missedPhishingScore, userId], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });

};

exports.getMaxTrainingPoints = (trainingId, callback) => {
    const getMaxPointsQuery = `
        SELECT max_points 
        FROM trainings 
        WHERE id = ?
    `;

    db.get(getMaxPointsQuery, [trainingId], (err, trainingRow) => {

        if (err) {
            return callback(err);
        }
        callback (null, trainingRow)
    });
}

exports.getUserTrainingInfo = (userId, trainingId, callback) => {
    const getTrainingResults = `
        SELECT withPointsCompleted, recognized_phishing_completed, missed_phishing_completed
        FROM user_trainings
        WHERE user_id = ? AND training_id = ?
    `;

    db.get(getTrainingResults, [userId, trainingId], (err, userTrainingRow) => {

        if (err) {
            return callback(err);
        }
        callback (null, userTrainingRow)
    });
}

exports.getEmailsFromDatabase = (callback) => {
    const query = 'SELECT * FROM phishing_quiz_emails ORDER BY date DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
};

exports.getUserAchievements = (userId, callback) => {
    const query = `
        SELECT b.id, b.name, b.description, b.image_path, 
        CASE WHEN ub.user_id IS NOT NULL THEN true ELSE false END AS earned
        FROM badges b
        LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = ?
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
};

exports.getQuestionsAndChoices = (callback) => {
    const query = `
        SELECT q.id as questionId, q.section, q.question, q.correct, q.reward, q.hint, q.points,
               c.choice_text as choices
        FROM intro_questions q
                 LEFT JOIN intro_quiz_choices c ON q.id = c.question_id
        ORDER BY q.id, c.id;
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }

        const questions = [];
        let currentQuestion = null;

        rows.forEach(row => {
            // Prüfen, ob wir mit einer neuen Frage zu tun haben
            if (!currentQuestion || currentQuestion.questionId !== row.questionId) {
                if (currentQuestion) {
                    questions.push(currentQuestion);
                }
                currentQuestion = {
                    questionId: row.questionId,
                    section: row.section,
                    question: row.question,
                    choices: [],  // Leeres Array für die Antwortmöglichkeiten
                    correct: row.correct.split(',').map(Number), // CSV-String in Array von Zahlen umwandeln
                    reward: row.reward,
                    hint: row.hint,
                    points: row.points
                };
            }
            // Antwortmöglichkeiten der aktuellen Frage hinzufügen
            if (row.choices) {
                currentQuestion.choices.push(row.choices);
            }
        });

        // Letzte Frage zum Array hinzufügen
        if (currentQuestion) {
            questions.push(currentQuestion);
        }

        callback(null, questions);
    });
};

exports.awardBadge = (userId, badgeName, callback) => {
    const query = `
        INSERT INTO user_badges (user_id, badge_id)
        SELECT ?, b.id
        FROM badges b
        WHERE b.name = ?
        ON CONFLICT DO NOTHING
    `;
    db.run(query, [userId, badgeName], callback);
};

exports.completeTraining = (userId, trainingId, timeSpent, withPointsCompleted, phishingRecognized, phishingMissed, callback) => {
    const selectQuery = `
        SELECT * FROM user_trainings 
        WHERE user_id = ? AND training_id = ?
    `;

    db.get(selectQuery, [userId, trainingId], (err, row) => {
        if (err) {
            return callback(err);
        }

        if (row) {
            // Eintrag existiert, führe ein Update durch
            const updateQuery = `
                UPDATE user_trainings
                SET completed = TRUE, completed_at = CURRENT_TIMESTAMP, time_spent = ?, withPointsCompleted = ?, recognized_phishing_completed = ?, missed_phishing_completed = ?
                WHERE user_id = ? AND training_id = ?
            `;
            db.run(updateQuery, [timeSpent, withPointsCompleted, phishingRecognized, phishingMissed, userId, trainingId], callback);
        } else {
            // Eintrag existiert nicht, füge ihn ein
            const insertQuery = `
                INSERT INTO user_trainings (user_id, training_id, completed, completed_at, time_spent, withPointsCompleted, recognized_phishing_completed, missed_phishing_completed)
                VALUES (?, ?, TRUE, CURRENT_TIMESTAMP, ?, ?, ?, ?)
            `;
            db.run(insertQuery, [userId, trainingId, timeSpent, withPointsCompleted, phishingRecognized, phishingMissed], callback);
        }
    });
};

exports.getTrainingOverview = (callback => {
 const query = `
    SELECT *
    FROM trainings
 `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return callback(err);
        }
        callback(null, rows);
    });
});

/*----- Dashboard Queries ---------*/
// Get user progress for dashboard (recognized/missed phishing scores and points)
exports.getUserProgress = (userId, callback) => {
    const query = `
        SELECT recognized_phishing_score, missed_phishing_score, points
        FROM users
        WHERE id = ?
    `;
    db.get(query, [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
};

// Get the fastest training time for the user
exports.getFastestTraining = (userId, callback) => {
    const query = `
        SELECT t.title, ut.time_spent
        FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.id
        WHERE ut.user_id = ?
        ORDER BY ut.time_spent ASC
        LIMIT 1
    `;
    db.get(query, [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
};

// Get the latest badge for the user
exports.getLatestBadge = (userId, callback) => {
    const query = `
        SELECT b.name, b.image_path, ub.earned_at
        FROM user_badges ub
        JOIN badges b ON ub.badge_id = b.id
        WHERE ub.user_id = ?
        ORDER BY ub.earned_at DESC
        LIMIT 1
    `;
    db.get(query, [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
};

// Get leaderboard for the fastest completion times for a specific training (Intro Phishing)
exports.getLeaderboard = (trainingId, callback) => {
    const query = `
        SELECT u.name, ut.time_spent
        FROM user_trainings ut
        JOIN users u ON ut.user_id = u.id
        WHERE ut.training_id = ?
        ORDER BY ut.time_spent ASC
        LIMIT 10
    `;
    db.all(query, [trainingId], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
};

// Gesamtzahl der abgeschlossenen Trainings und die Anzahl der vorhandenen Trainings abrufen
exports.getTrainingProgress = (userId, callback) => {
    const query = `
        SELECT 
            COUNT(CASE WHEN ut.completed = TRUE THEN 1 END) as completedTrainings,
            COUNT(t.id) as totalTrainings,
            SUM(CASE WHEN ut.completed = TRUE THEN ut.withPointsCompleted ELSE 0 END) as userTotalPoints,
            SUM(t.max_points) as maxTotalPoints
        FROM trainings t
        LEFT JOIN user_trainings ut ON t.id = ut.training_id AND ut.user_id = ?
    `;
    db.get(query, [userId], (err, row) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, row);
    });
};



