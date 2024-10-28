const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    blogTitle: String,
    category: String,
    image: String,
    blogDescription: String,
    author: {type: Schema.Types.ObjectId , ref: "user"},
})

module.exports = mongoose.model("blog", blogSchema);