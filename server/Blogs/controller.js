const blog = require("./Blogs"); 
const fs = require("fs");
const path = require("path");
const createBlog = async(req, res) => {
    if(req.file && 
        req.body.blogTitle && 
        req.body.category && 
        req.body.blogDescription)
    {
        await new blog({
            blogTitle: req.body.blogTitle,
            category: req.body.category,
            image: `/images/blogs/${req.file.filename}`,
            blogDescription: req.body.blogDescription,
            author: req.user._id,
        }).save()
        res.redirect(`/myprofile/${req.user._id}`);
    }else{
        res.redirect("/new?error=1"); 
    }
}

const editBlog = async(req, res) => {
    if(req.file){
        const blogs = await blog.findById(req.body.id);
        fs.unlinkSync(path.join(__dirname + "../../../public" + blogs.image));
        blogs.blogTitle = req.body.blogTitle;
        blogs.category = req.body.category;
        blogs.blogDescription = req.body.blogDescription;
        blogs.image = `/images/blogs/${req.file.filename}`;
        blogs.author = req.user._id;
        await blogs.save();
        res.redirect(`/profile/${req.user._id}`);   
    }else{
        res.redirect(`/edit/${req.body.id}?error=1`);
    }
}

const deleteBlog = async(req, res) => {
    const blogs = await blog.findById(req.params.id);
    if(blogs){
        fs.unlinkSync(path.join(__dirname + "../../../public" + blogs.image));
        await blog.deleteOne({_id: req.params.id});
        res.status(200).send("ok");
    }else{
        res.status(404).send("not found");
    }
}

module.exports = {createBlog, editBlog, deleteBlog};