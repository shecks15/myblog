const express = require("express");
const passport = require("passport")
const router = express.Router();
const {signUp, signIn, signOut} = require("./controller")
const createAdmin = require("../Admin/seed");


router.post("/api/signup", signUp)
router.post("/api/signin", passport.authenticate("local", {failureRedirect : "/login?error=1"}), signIn)
router.get("/api/signout", signOut)
router.get('/auth/github', passport.authenticate('github', (req, res) => {
    res.redirect('/myprofile/' + req.user._id);
}));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/myprofile/' + req.user._id);
  }
);
createAdmin();

module.exports = router;