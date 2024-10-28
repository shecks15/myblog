function sendComment(e) {
    e.preventDefault();
    
    const commentText = document.getElementById("comment-text").value.trim();
    const blogId = document.getElementById("comment-blog").value.trim();
    const authorId = document.getElementById("comment-author").value.trim();
    
    axios.post("/api/comment", {
        text: commentText,
        blogId: blogId,
        authorId: authorId
    })
    .then(response => {
        console.log("Комментарий добавлен:", response.data);
        location.reload(); 
    })
    .catch(error => {
        console.error("Ошибка при добавлении комментария:", error.response ? error.response.data : error.message);
    });
}

