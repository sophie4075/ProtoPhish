// achievementsController.js
const dbQueries = require('../models/dbQueries');

exports.getAchievements = (req, res) => {
    if (req.user) {
        dbQueries.getUserAchievements(req.user.id, (err, achievements) => {
            if (err) {
                return res.status(500).send('Serverfehler beim Abrufen der Achievements');
            }

            res.render('achievements', {
                user: req.user,
                achievements: achievements
            });
        });
    } else {
        res.redirect('/login');
    }
};
