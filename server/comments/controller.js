const Comment = require("./comments");

const saveComment = async (req, res) => {
    const { authorId, blogId, text } = req.body;
    try {
        const newComment = new Comment({
            text: text,
            authorId: authorId,
            blogId: blogId,
            timestamps: Date.now()
        });

        await newComment.save();

        res.send("Комментарий добавлен");
    } catch (error) {
        console.error("Ошибка сохранения комментария:", error);
        res.status(500).send("Ошибка при сохранении комментария");
    }
};



module.exports = {saveComment};