const express = require("express");
const router = express.Router();
const genres = require("../genres/genres");
const user = require("../auth/user");
const blog = require("../Blogs/Blogs");
const comment = require("../comments/comments");
const moment = require("moment-timezone");

router.get("/", async(req, res) => {
    const category = req.query.category;
    const options = {};
    if(category){
        options.category = category;
        res.locals.category = req.query.category;
    }
    if(req.query.search && req.query.search.length > 0){
        options.$or = [
            {blogTitle: new RegExp(req.query.search, "i")},
        ]
        res.locals.search = req.query.search;
    }
    let page = 0;
    const limit = 3;
    if(req.query.page && req.query.page > 0){
        page = req.query.page;
    };
    const totalBlogs = await blog.countDocuments(options);
    const blogs = await blog.find(options).limit(limit).skip(page * limit).populate("author");
    const categories = await blog.distinct("category");
    res.render("index", {user: req.user ? req.user : {}, blogs, categories, pages: Math.ceil(totalBlogs / limit), isProfile: false});
})

router.get("/login", async(req, res) => {
    res.render("login", {user: req.user ? req.user : {}, isProfile: false});
})

router.get("/register", async(req, res) => {
    res.render("register", {user: req.user ? req.user : {}, isProfile: false});
})

router.get("/profile/:id", async(req, res) => {
    const blogs = await blog.find().populate("author");
    const User = await user.findById(req.params.id);
    if(User){
        res.render("profile", {user: User, loginUser: req.user, blogs: blogs, isProfile: false});
    }else{
        res.redirect("/login");
    }
})

router.get("/admin/:id", async(req, res) => {
    const blogs = await blog.find()
    const User = await user.findById(req.params.id);
    res.render("adminProfile", {loginUser: req.user ? req.user : {}, user: User, blogs: blogs, isProfile: false});
})

router.get("/new", async(req, res) => {
    const blogs = await blog.find()
    res.render("new", {user: req.user ? req.user : {}, blogs: blogs, isProfile: false});
})

router.get("/edit/:id", async(req, res) => {
    const blogs = await blog.findById(req.params.id);
    res.render("edit", {user: req.user ? req.user : {}, blogs: blogs, isProfile: false});
})

router.get("/myprofile/:id", async(req, res) => {
    const User = await user.findById(req.params.id);
    const blogs = await blog.find({author : User._id});
    res.render("myprofile", {user: req.user ? req.user : {}, user: User, blogs: blogs, isProfile: true});
})

router.get("/notLogged/:id", async(req, res) => {
    const comments = await comment.find({blogId: req.params.id}).populate("authorId");
    const blogs = await blog.findById(req.params.id).populate("author");
    const formattedComments = comments.map(comment => ({
        ...comment._doc,
        formattedTime: moment(comment.createdAt).tz('Asia/Almaty').format('HH:mm')
    }));
    res.render("notLogged", {user: req.user ? req.user : {}, blogs: blogs, comments: formattedComments, isProfile: false});
})

router.get("/detail/:id", async(req, res) => {
    const blogs = await blog.findById(req.params.id).populate("author");
    res.render("detail", {user: req.user ? req.user : {}, blogs: blogs, isProfile: false});
})

router.get("/another/:id", async(req, res) => {
    const author = await user.findById(req.params.id);
    const blogs = await blog.find({author : author._id});
    res.render("anotherUser", {user: req.user ? req.user : {}, author: author, blogs: blogs, isProfile: false});
})

module.exports = router;