const dbQueries = require('../models/dbQueries');

exports.loadTrainings = (req, res, next) => {
    dbQueries.getTrainingOverview((err, trainings) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Laden der Trainings' });
        }

        req.trainings = trainings; // Trainingsdaten zum req-Objekt hinzufügen
        next(); // Weiter zur nächsten Middleware oder Route
    });
};
