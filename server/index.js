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
    User.findOne({ "google_id": profile.id })
      .select("_id google_id")
      .exec(function(err, user) {
        done(err, user);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
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

const Balance = mongoose.model("balance", {
  balance: Number
});
const router = express.Router();

router.route("/balance")
  .get((req, res) => {
    Balance.findOne()
      .select("balance")
      .exec((err, balance) => {
        if (balance) {
          res.json(balance.balance);
        }
      });
  });

app.use("/api", router);


app.listen(port);
