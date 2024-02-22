document.addEventListener("DOMContentLoaded", function () {
    const newPostButton = document.getElementById("new-post");
    const newPostForm = document.getElementById("new-post-form");
    const postForm = document.getElementById("post-form");
    const userPostsContainer = document.getElementById("user-posts-container");
    const editPostContainer = document.querySelector("#edit-post-container");

    userPostsContainer.addEventListener("click", function (event) {
        const postElement = event.target.closest(".post");
        if (postElement) {
            const postId = postElement.dataset.postid;
            userPostsContainer.style.display = "none";
            newPostButton.style.display = "none";
            editPostContainer.style.display = "block";
            displayPostForEditing(postId);
        }
    });

    async function displayPostForEditing(postId) {
        try {
            const response = await fetch(`/api/posts/${postId}`); // Adjust the endpoint URL as per your API
            if (!response.ok) {
                throw new Error("Failed to fetch post data");
            }
            const postData = await response.json();
            // Populate the edit post form fields with the retrieved post data
            document.getElementById("edit-post-title").value = postData.title;
            document.getElementById("edit-post-content").value = postData.content;
            document.getElementById("edit-post-id").value = postId;
        } catch (error) {
            console.error("Error fetching post data:", error);
        }
    }


    newPostButton.addEventListener("click", function () {
        newPostForm.style.display = "block";
        userPostsContainer.style.display = "none";
    });

    postForm.addEventListener("submit", async function (event) {
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

            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Error creating new post:", error);
        }
    });
});