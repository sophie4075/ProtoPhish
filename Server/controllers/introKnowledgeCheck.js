const dbQueries = require('../models/dbQueries');

exports.loadQuiz = (req, res, next) => {
    dbQueries.getQuestionsAndChoices((err, questions) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Laden der Quizfragen' });
        }
        req.questions = questions;
        next();
    });
};



exports.submitQuizResults = (req, res) => {
    let {points, recognizedPhishingScore, missedPhishingScore, badges, timeSpent } = req.body;
    const userId = req.user.id;
    const trainingId = 1;


    // Hole die maximalen Punkte für das Training
    dbQueries.getMaxTrainingPoints(trainingId, (err, trainingRow) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Abrufen der maximalen Punkte' });
        }

        const maxPoints = trainingRow.max_points;

        // Hole die bisherigen Trainingsergebnisse des Nutzers
        dbQueries.getUserTrainingInfo(userId, trainingId, (err, userTrainingRow) => {
            if (err) {
                return res.status(500).json({ message: 'Fehler beim Abrufen der bisherigen Trainingsergebnisse' });
            }

            let previousScore = 0;
            let previousRecognizedPhishing = 0;
            let previousMissedPhishing = 0;

            if (userTrainingRow) {
                previousScore = userTrainingRow.withPointsCompleted;
                previousRecognizedPhishing = userTrainingRow.recognized_phishing_completed;
                previousMissedPhishing = userTrainingRow.missed_phishing_completed;
            }

            if (points <= 0 && previousScore > 0) {
                badges.push('Phishing-Opfer');
            }

            const scoreDifference = Math.min(points, maxPoints) - previousScore;
            const recognizedPhishingDifference = recognizedPhishingScore - previousRecognizedPhishing;
            const missedPhishingDifference = missedPhishingScore - previousMissedPhishing;

            // Aktualisiere Benutzerergebnisse in der Datenbank
            dbQueries.updateUserResults(userId, scoreDifference, recognizedPhishingDifference, missedPhishingDifference, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Fehler beim Speichern der Ergebnisse' });
                }

                // Prüfe und speichere Badges
                badges.forEach(badgeName => {
                    dbQueries.awardBadge(userId, badgeName, (err) => {
                        if (err) {
                            console.error(`Fehler beim Speichern des Badges ${badgeName}:`, err);
                        }
                    });
                });

                // Training als abgeschlossen markieren und aktualisieren
                dbQueries.completeTraining(userId, trainingId, timeSpent, points, recognizedPhishingScore, missedPhishingScore, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Fehler beim Markieren des Trainings' });
                    }
                    res.json({ message: 'Ergebnisse und Badges erfolgreich gespeichert' });
                });
            });
        });
    });
};


/*exports.submitQuizResults = (req, res) => {
    const { points, recognizedPhishingScore, missedPhishingScore, badges, timeSpent } = req.body;
    const userId = req.user.id;

    // Aktualisiere Benutzerergebnisse in der Datenbank
    dbQueries.updateUserResults(userId, points, recognizedPhishingScore, missedPhishingScore, timeSpent, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Speichern der Ergebnisse' });
        }

        // Prüfe und speichere Badges
        badges.forEach(badgeName => {
            dbQueries.awardBadge(userId, badgeName, (err) => {
                if (err) {
                    console.error(`Fehler beim Speichern des Badges ${badgeName}:`, err);
                }
            });
        });

        // Training als abgeschlossen markieren
       dbQueries.completeTraining(userId, 1, timeSpent,  (err) => {
            if (err) {
                return res.status(500).json({ message: 'Fehler beim Markieren des Trainings' });
            }
            res.json({ message: 'Ergebnisse und Badges erfolgreich gespeichert' });
        });
    });
};*/







