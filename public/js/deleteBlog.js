function deleteBlogs(id, authorID){
    if(id && authorID){
        axios.delete(`/api/blogs/${id}`).then(data => {
            if(data.status == 200){
                window.location.href = `/profile/${authorID}`;
            }else if(data.status == 404){
                window.location.href = `/profile/${authorID}?error=404`;
            }
        }).catch(err => {
            console.error(err);
            window.location.href = `/profile/${authorID}?error=500`;
        });
    }else{
        console.error("Invalid ID or authorID");
    }
}