const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const logger = require("morgan");


// Mongo and Mongoose setup
const mongoose = require("mongoose");
const User = mongoose.model("Users", {
  google_id: String
});
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI);


// Passport setup
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile: " + JSON.stringify(profile));
    User.findOne({ "google_id": profile.id })
      .select("_id google_id")
      .exec(function(err, user) {
      if (err) {
        console.log("got error!");
      } else if (user) {
        console.log("found user: " + JSON.stringify(user));
      } else {
        console.log("did not find user");
      }
      done(err, user);
    })
  }
));

passport.serializeUser(function(user, done) {
  console.log("serialize user: " + JSON.stringify(user));
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserialize user: " + JSON.stringify(user));
  done(null, user);
});




app.use(logger(process.env.HTTP_LOGGING_FORMAT));




// Express authentication setup
const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/callback",
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  });

function authenticate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
}



// Route declaration
app.use(authenticate, express.static("public"));

app.listen(port);
