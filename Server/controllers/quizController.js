const emails = require("../public/data/emails.js");
const dbQueries = require('../models/dbQueries');
const hbs = require('hbs');

exports.getEmails = (req, res, next) => {

    console.log("E-Mails aus JSON geladen:", emails);
    req.emails = emails;
    next(); // Weiter zum nächsten Middleware/Handler
};

exports.getEmailById = (req, res) => {
    const emailId = req.params.id;
    console.log(`Anfrage nach E-Mail mit ID: ${emailId}`);

    const email = emails.find(email => email.id === emailId);
    if (email) {
        res.json(email);
    } else {
        console.log(`E-Mail mit ID ${emailId} nicht gefunden`);
        res.status(404).json({ error: 'E-Mail nicht gefunden' });
    }
};



//DB Request for Mails
exports.loadEmails = (req, res, next) => {
    const user = req.user;
    dbQueries.getEmailsFromDatabase((err, emails) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Abrufen der E-Mails' });
        }
        if (!emails || emails.length === 0) {
            console.warn('Keine E-Mails in der Datenbank gefunden.');
            req.emails = []; // Leeres Array übergeben, wenn keine E-Mails gefunden werden
        } else {
            console.log(user.name);
            emails.forEach(email => {
                const template = hbs.compile(email.message);
                email.message = template({ name: user.name });  // Ersetze {{name}} mit dem tatsächlichen Namen des Benutzers
            })
            req.emails = emails; // E-Mails erfolgreich geladen
            console.log("Mails im Controller");
        }
        next();
    });
};

exports.submitQuizResults = (req, res) => {
    let {points, recognizedPhishingScore, missedPhishingScore, timeSpent, totalEmails} = req.body;  // totalEmails wird hier extrahiert
    const userId = req.user.id;
    const trainingId = 2;

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

            const scoreDifference = Math.min(points, maxPoints) - previousScore;
            const recognizedPhishingDifference = recognizedPhishingScore - previousRecognizedPhishing;
            const missedPhishingDifference = missedPhishingScore - previousMissedPhishing;

            // Evaluiere die Badges
            const earnedBadges = evaluateBadges(points, recognizedPhishingScore, missedPhishingScore, previousScore, previousRecognizedPhishing, previousMissedPhishing, userTrainingRow, totalEmails);
            console.log('Earned Badges:', earnedBadges);
            // Aktualisiere Benutzerergebnisse in der Datenbank
            dbQueries.updateUserResults(userId, scoreDifference, recognizedPhishingDifference, missedPhishingDifference, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Fehler bei UpdateUserResults' });
                }

                // Prüfe und speichere Badges
                earnedBadges.forEach(badgeName => {
                    console.log(badgeName);
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
                    res.json({ success: true, message: 'Ergebnisse und Badges erfolgreich gespeichert' });
                });
            });
        });
    });
};


function evaluateBadges(points, recognizedPhishingScore, missedPhishingScore, previousScore, previousRecognizedPhishing, previousMissedPhishing, userTrainingRow, totalEmails) {
    console.log('Evaluating Badges:', { points, recognizedPhishingScore, missedPhishingScore, previousScore, previousRecognizedPhishing, previousMissedPhishing, totalEmails });

    let badges = [];

    // Phishauge: Erkenne in jeder Mail den Phishing-Versuch beim ersten Anlauf
    if (recognizedPhishingScore === totalEmails / 2 && !userTrainingRow) {
        badges.push('Phishauge');
    }

    // Skeptischer Profi: Melde jede verdächtige E-Mail im Phish-Quiz
    if (recognizedPhishingScore === totalEmails / 2) {
        badges.push('Skeptischer Profi');
    }

    // Blinder Passagier: Melde keine einzige verdächtige E-Mail im Phish-Quiz
    if (recognizedPhishingScore === 0 && missedPhishingScore === totalEmails / 2) {
        badges.push('Blinder Passagier');
    }

    // Leichtgläubiger Phish: Falle auf mehr als 50% der Phishing-Mails herein
    if (missedPhishingScore > totalEmails / 4) {
        badges.push('Leichtgläubiger Phish');
    }

    // Phishing-Opfer: Verliere alle Punkte durch falsche Antworten
    if (points <= 0 && previousScore > 0) {
        badges.push('Phishing-Opfer');
    }

    // Sicher ist sicher: Markiere alle E-Mails als verdächtig, auch die legitimen
    if (recognizedPhishingScore + missedPhishingScore === totalEmails) {
        badges.push('Sicher ist sicher');
    }

    // Meister des Chaos: Kennzeichne jede Phishing-Mail als sicher und jede legitime Mail als Phishing
    if (recognizedPhishingScore === 0 && missedPhishingScore === totalEmails) {
        badges.push('Meister des Chaos');
    }

    return badges;
}



