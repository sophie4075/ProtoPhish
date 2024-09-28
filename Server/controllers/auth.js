const dbQueries = require('../models/dbQueries')
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const crypt = require('bcryptjs');

exports.register = async (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
        return res.render('register', {
            message: 'Passwords do not match! Please try again.'
        });
    }



    dbQueries.register(email, (error, result) => {
        if (error) {
            return res.render('register', {
                message: 'Something went wrong, please contact the system admin'
            });
        }

        if(result && result.message){
            return res.render('register', {
                message: result.message
            })
        }
    });

    try{
        let hashedPassword = await crypt.hash(password, 8);
        await new Promise((resolve, reject) => {
            dbQueries.createUser({name: name, email: email, password: hashedPassword}, (error) => {
                if (error){
                    return reject(error);
                }
                resolve();
            });
        });

        res.redirect('/login');
    } catch (error){
        res.render('register', {
            message: 'Something went wrong during registration. Please try again.'
        });
    }

}




exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide and email and password'
            })
        }

        dbQueries.login({email, password}, (error, result) => {
            console.log(result);
            if (error) {
                console.error('Error during login:', error.message);
                return res.status(500).send('Server error');
            }

            if (!result.success) {
                // 401 if login credentials are incorrect
                return res.status(401).render('login', { message: result.message });
            }

            if(result.success){
                const token = jwt.sign({id: result.user.id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log('The token is: ' + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/dashboard");
            }


        })


    } catch (error){
        console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next) => {


    if(req.cookies.jwt && req.cookies.jwt !== 'logout'){
        try {
            // 1) Verify Token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
            console.log(decoded)

            //Check if user still exists
            dbQueries.checkForUser({id: decoded.id}, (error, result) => {
                console.log(result);
                if (error) {
                    console.error('Fehler bei der Benutzerüberprüfung:', error.message);
                    return res.status(500).send('Serverfehler');
                }

                if (!result.success) {
                    return next();
                }


                req.user = result.user;
                return next();


            })

        } catch (error){
            console.log(error);
            return next();
        }
    } else {
        next();
    }



}

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    });

    res.status(200).redirect('/');
}