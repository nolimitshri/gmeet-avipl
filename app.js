const express = require('express');
const app = express();
const port = 3000;
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const Meeting = require('google-meet-api').meet;
const ejs = require("ejs");
const res = require('express/lib/response');
const Meet = require("./model/gmeet");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/meetAviplDB", {useNewUrlParser: true})
.then(() => console.log("Mongo Connected........"))
.catch((e) => console.log(e));


var fullD, date, time;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");

clientID = "889871673008-6rb7lv7bpu4jec8455qmrdt3s05jalmr.apps.googleusercontent.com"
clientSecret = "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"

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/auth/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        Meeting({
            clientId: clientID,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            date: date,
            time: time,
            summary: "summary",
            location: "location",
            description: "description",
            checking:0
        }).then(function (result) {
            const link = result;
            // console.log(link);
            // console.log(fullD.replace("T", " "));
            const newMeet = new Meet({
                link: result,
                date: fullD.replace("T", " ")
            });

            newMeet.save();

            console.log("The meeting Link is: "+result);            
        }).catch((error) => {
            console.log(error)
        });
        return cb();
    }
));

app.get("/fail", (req, res)=>{
    res.send("FAILED!!");
})

app.get('/auth/callback',
    passport.authenticate('google', { failureRedirect: '/', successRedirect: "/" })
);

app.get('/auth',
    passport.authenticate('google', {
        scope: ['profile','https://www.googleapis.com/auth/calendar'],
        accessType: 'offline',
        prompt: 'consent'
    }
    ));

app.get("/meet", (req, res) => {
    res.render("meet");
});

app.post("/meet", async(req, res) => {
    var {date1} = req.body;
    fullD = date1;
    fullD = fullD.concat(":00.000Z");
    // Validation RegEx for correct YYYY-MM-DD date if true then redirect to /auth else re-render this route.
    date = date1.split('T')[0];
    time = date1.split('T')[1];
    res.redirect("/auth");
    // res.send("Hello");
});

app.get('/',function(req,res){
    if(link !== undefined){
        console.log(link);
        res.send(link + " This is the link !!!")
    }
    res.send("done" + link);
})

app.listen(port, function (err) {
    if (err) {
        console.log('something wrong in starting server !!!');
        return;
    }
    return console.log("server is up and running on port ", port);
});