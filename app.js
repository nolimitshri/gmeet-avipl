const express = require('express');
const app = express();
const port = 3000;
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const Meeting = require('google-meet-api').meet;
const ejs = require("ejs");
const res = require('express/lib/response');
var date, time, link;

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
            link = result;
            console.log("The meeting Link is: "+result);            
        }).catch((error) => {
            console.log(error)
        });
        return cb();
    }
));

app.get('/auth/callback',
    passport.authenticate('google', { failureRedirect: '/', successRedirect: "/done" })
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
    var {date1, time1} = req.body;
    // Validation RegEx for correct YYYY-MM-DD date if true then redirect to /auth else re-render this route.
    console.log(date1, time1);
    date = date1;
    time = time1;
    res.redirect("/auth");
});

app.get('/',function(req,res){
    // if(link === undefined){
    //     res.redirect("/meet");
    // }
    // res.json({Status: "Success", Message: `The Meeting is on ${date}`, Link: link});
    console.log(link);
    res.send("done");
})

app.listen(port, function (err) {
    if (err) {
        console.log('something wrong in starting server !!!');
        return;
    }
    return console.log("server is up and running on port ", port);
});