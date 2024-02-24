const format_date = (date) => {
    // Check if the input date is valid
    if (!date) return '';

    // Convert the date to a JavaScript Date object
    const postDate = new Date(date);

    // Get the month, day, and year of the post's creation date
    const month = postDate.getMonth() + 1;
    const day = postDate.getDate();
    const year = postDate.getFullYear();

    // Return the formatted date as MM/DD/YYYY
    return `${month}/${day}/${year}`;
};

document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch comments associated with a blog post
    const commentsContainer = document.querySelector('.comments-container');

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    };

    // Function to display comments in the UI
    const displayComments = (comments) => {
        commentsContainer.innerHTML = ''; // Clear previous comments

        console.log(comments);

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p>${comment.content}</p>
                <p>-${comment.user.username}, ${format_date(comment.createdAt)}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    };

    // Function to hide all other posts
    const hideOtherPosts = (selectedPost) => {
        document.querySelectorAll('.post-details').forEach(post => {
            if (post !== selectedPost) {
                post.style.display = 'none';
            }
        });
    };

    const commentFormContainer = document.querySelector('.comment-form-container');

    // Function to add the "Add Comment" button
    const addAddCommentButton = (post) => {
        const addCommentButton = document.createElement('button');
        addCommentButton.textContent = 'Add Comment';
        addCommentButton.classList.add('add-comment-button');

        // Add event listener for the button click
        addCommentButton.addEventListener('click', (event) => {
            // Logic to handle the "Add Comment" button click
            console.log('Add Comment button clicked');

            commentsContainer.style.display = 'none';
            commentFormContainer.style.display = 'block';
            event.target.style.display = 'none';
            event.stopPropagation(); // Prevent event bubbling
        });

        // Append the button to the selected post
        post.appendChild(addCommentButton);
    };

    // Add click event listener to post details elements
    document.querySelectorAll('.post-details').forEach(post => {
        post.addEventListener('click', async () => {
            const postId = post.dataset.blogPostId;
            console.log(postId);
            const comments = await fetchComments(postId);
            displayComments(comments);
            addAddCommentButton(post);
            hideOtherPosts(post);
        });
    });

    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the comment content from the form
        const content = document.getElementById('comment').value.trim();
        if (!content) {
            alert('Please enter a comment.'); // Display an alert if the comment is empty
            return;
        }

        commentFormContainer.style.display = 'none';
        commentsContainer.style.display = 'block';

        // Get the blog post ID from the post details element
        const postId = document.querySelector('.post-details').dataset.blogPostId;

        try {
            // Send a POST request to create a new comment
            const response = await fetch('/api/comments/new-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, blogPostId: postId })
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            // Reset the comment form after successful submission
            document.getElementById('comment').value = ''; // Clear the comment textarea
            console.log('Comment submitted successfully');

            // Display the newly added comment
            const newCommentData = await response.json();
            console.log(newCommentData);

            const newCommentElement = document.createElement('div');
            newCommentElement.classList.add('comment');
            newCommentElement.innerHTML = `
                <p>${newCommentData.comment.content}</p>
                <p>-${newCommentData.user.username}, ${format_date(newCommentData.comment.createdAt)}</p>
            `;

            // Append the new comment element to the comments container
            commentsContainer.appendChild(newCommentElement);

            // Add the "Add Comment" button back to the post
            const post = document.querySelector('.post-details');
            addAddCommentButton(post);

        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Failed to submit comment. Please try again later.');
        }
    });

});
