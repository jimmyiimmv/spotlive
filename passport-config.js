const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/users')

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'No user with that email' })
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err

                        if(isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, {message: 'Password incorrect'})
                        }
                    })
                })
                .catch(err => console.log(err))
        })
    )

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}














/*
function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: "No user with that email"})
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }  

    passport.use(new LocalStrategy({ usernameField: 'email' },
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    })
}
*/
