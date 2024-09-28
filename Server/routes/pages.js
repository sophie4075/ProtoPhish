const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const quizController = require('../controllers/quizController');
const badgeController = require('../controllers/badgeController');
const introKnowledgeCheck = require('../controllers/introKnowledgeCheck');
const trainingController = require('../controllers/trainings');
const {json} = require("express");
const dbQueries = require("../models/dbQueries");


router.get('/', authController.isLoggedIn, (req, res) => {

   /* if (req.user) {
        res.redirect('dashboard', {
            user: req.user
        });
    } else {
        res.redirect('index');

    }*/

    if (!req.user) {
        return res.redirect('login');
    }

    const userId = req.user.id;
    const introTrainingId = 1; // Beispielhaft für das Intro-Phishing-Training

    // Mehrere Daten parallel abfragen
    const async = require('async');
    async.parallel({
        progress: callback => dbQueries.getUserProgress(userId, callback),
        trainingProgress: callback => dbQueries.getTrainingProgress(userId, callback),
        fastestTraining: callback => dbQueries.getFastestTraining(userId, callback),
        latestBadge: callback => dbQueries.getLatestBadge(userId, callback),
        leaderboard: callback => dbQueries.getLeaderboard(introTrainingId, callback)
    }, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Laden des Dashboards' });
        }

        res.render('dashboard', {
            user: req.user,
            trainingProgress: results.trainingProgress,
            progress: results.progress,
            fastestTraining: results.fastestTraining,
            latestBadge: results.latestBadge,
            leaderboard: results.leaderboard
        });
    });

});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if (req.user) {
        res.render('profile', {
            user: req.user
        });
    } else {
        res.redirect('/login');
    }

});

router.get('/dashboard', authController.isLoggedIn, (req, res) => {
    /*if (req.user) {
        res.render('dashboard', {
            user: req.user
        });
    } else {
        res.redirect('login');
    }*/

    if (!req.user) {
        return res.redirect('login');
    }

    const userId = req.user.id;
    const introTrainingId = 1; // Beispielhaft für das Intro-Phishing-Training

    // Mehrere Daten parallel abfragen
    const async = require('async');
    async.parallel({
        progress: callback => dbQueries.getUserProgress(userId, callback),
        trainingProgress: callback => dbQueries.getTrainingProgress(userId, callback),
        fastestTraining: callback => dbQueries.getFastestTraining(userId, callback),
        latestBadge: callback => dbQueries.getLatestBadge(userId, callback),
        leaderboard: callback => dbQueries.getLeaderboard(introTrainingId, callback)
    }, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Fehler beim Laden des Dashboards' });
        }

        res.render('dashboard', {
            user: req.user,
            progress: results.progress,
            trainingProgress: results.trainingProgress,
            fastestTraining: results.fastestTraining,
            latestBadge: results.latestBadge,
            leaderboard: results.leaderboard
        });
    });

});

// router.get('/intro', authController.isLoggedIn, (req, res) => {
//     if (req.user) {
//         res.render('intro', {
//             user: req.user
//         });
//     } else {
//         res.redirect('login');
//     }
//
// });

router.get('/intro', authController.isLoggedIn, introKnowledgeCheck.loadQuiz, (req, res) => {
    if (req.user) {
        res.render('intro', {
            user: req.user,
            questions: req.questions
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/trainings', authController.isLoggedIn, trainingController.loadTrainings,  (req, res) => {
    if (req.user) {
        res.render('trainings', {
            user: req.user,
            trainings: req.trainings
        });
    } else {
        res.redirect('login');
    }
});

router.get('/achievements', authController.isLoggedIn, badgeController.getAchievements);

router.get('/phish-quiz', authController.isLoggedIn, quizController.loadEmails, (req, res) => {
    console.log("E-Mails an die View übergeben:", req.emails);
    if (req.user) {

        res.render('phish-quiz', {
            user: req.user,
            emails: req.emails
        });

    } else {
        res.redirect('/login');
    }

});

//router.get('/emails/:id', authController.isLoggedIn, quizController.getEmailById);

router.post('/submit-phishing-quiz-results', authController.isLoggedIn, quizController.submitQuizResults);

router.post('/submit-intro-results', authController.isLoggedIn, introKnowledgeCheck.submitQuizResults);


module.exports = router;