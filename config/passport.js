const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.use(
  new LocalStrategy({ usernameField: 'dlsuEmail' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ dlsuEmail: email });
      if (!user) return done(null, false, { message: '❌ Email not registered' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: '❌ Incorrect password' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});