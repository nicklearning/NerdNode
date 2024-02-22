document.addEventListener("DOMContentLoaded", function() {
    const newPostButton = document.getElementById("new-post");
    const newPostForm = document.getElementById("new-post-form");
    const postForm = document.getElementById("post-form");

    newPostButton.addEventListener("click", function() {
        newPostForm.style.visibility = "visible";
    });

    postForm.addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const title = document.getElementById("title").value;
        const content = document.getElementById("content").value;

        try {
            const response = await fetch("/api/posts/create-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: title, content: content })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("New post created:", data);
            postForm.reset();
            newPostForm.style.visibility = "hidden"; 
        } catch (error) {
            console.error("Error creating new post:", error);
        }
    });
});