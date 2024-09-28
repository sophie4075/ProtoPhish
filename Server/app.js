require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const emails = require("./public/data/emails.js");
const hbs = require('hbs');




const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}));


//Parse JSON bodies (as sent by API Clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

hbs.registerHelper('json', function (context) {
    if (!context) {
        return 'null';  // Falls `context` undefined ist, gebe eine Zeichenkette 'null' zurück.
    }
    return JSON.stringify(context).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');;
});

hbs.registerHelper('add', function (a, b) {
    return a + b;
});

hbs.registerHelper('increment', function(value) {
    return parseInt(value) + 1;
});

hbs.registerHelper('mod', function (index, divisor){
    return index % divisor === 0;
})


//Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));




app.listen(5001, () => {
    console.log("Server started on Port 5001");
});

