const passport = require("passport")
const user = require("../auth/user")
const bcrypt = require("bcrypt")
const localStrategy = require("passport-local")
const GitHubStrategy = require('passport-github2').Strategy;
// Client ID Ov23ctdl8mw4nSz5F1hv
// client secret 9353d0acde01de593ac8644eb693924a9561c98d

passport.use(new localStrategy(
    {
        usernameField: "email",
    },
    function(email, password, done){
        user.findOne({email}).then(user => {
            if(user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err){return done(err)}
                    if(result){return done(null, user)}
                });
            }else{
                return done("Пользователь не найден")
            }
        }).catch(e => {
            return done(e)
        })
    }
));

passport.use(new GitHubStrategy({
    clientID: "Ov23ctdl8mw4nSz5F1hv",
    clientSecret: "9353d0acde01de593ac8644eb693924a9561c98d",
    callbackURL: "http://localhost:8000/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let existingUser = await user.findOne({ githubId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = new user({
          githubId: profile.id,
          full_name: profile.username,
          email: profile.emails ? profile.emails[0].value : null 
        });
        await newUser.save();
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));


passport.serializeUser(function(user, done){
    done(null, user._id)
})

passport.deserializeUser(function(id, done){
    user.findById(id).then((user, err) => {
        done(err, user)
    })
})