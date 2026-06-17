const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, UserProfile } = require('../models');
const activityService = require('../services/activityService');

console.log('--- Passport Google Strategy Config ---');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Loaded' : 'Missing');
console.log('CALLBACK_URL env:', process.env.CALLBACK_URL);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('--- Google OAuth Callback Received ---');
    console.log('Profile ID:', profile.id);
    try {
      let user = await User.findOne({ where: { googleId: profile.id } });
      
      if (!user) {
        // Check if email already exists
        user = await User.findOne({ where: { email: profile.emails[0].value } });
        
        if (user) {
          user.googleId = profile.id;
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar_url: profile.photos[0]?.value,
            isEmailVerified: true,
            accountStatus: 'active',
            role: 'user'
          });
          
          await UserProfile.create({ userId: user.id });
        }
        await activityService.logActivity(user.id, 'GOOGLE_REGISTER', 'User registered via Google OAuth');
      }

      user.lastLogin = new Date();
      await user.save();
      await activityService.logActivity(user.id, 'GOOGLE_LOGIN', 'User logged in via Google OAuth');

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
