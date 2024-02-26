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
    // Select the "Add Comment" button
    const addCommentButtons = document.querySelectorAll('.add-comment-button');
    const commentForm = document.querySelector('#comment-form');
    const submitButton = commentForm.querySelector('button[type="submit"]');


    addCommentButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Logic to handle when the button is clicked
            console.log('Add Comment button clicked');
            event.stopPropagation();
            const postDetailsContainer = button.closest('.post-details-container');
            const commentFormContainer = postDetailsContainer.querySelector('.comment-form-container');

            // For example, you can show/hide the comment form
            if (commentFormContainer.style.display === 'none') {
                commentFormContainer.style.display = 'flex';
            } else {
                commentFormContainer.style.display = 'none';
            }
        });
    });


    submitButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const postDetailsContainer = submitButton.closest('.post-details-container');
        console.log(postDetailsContainer);
        if (!postDetailsContainer) {
            console.error('Post details container not found.');
            return;
        }

        // Find the comment form container within the post details container
        const commentFormContainer = postDetailsContainer.querySelector('.comment-form-container');
        if (!commentFormContainer) {
            console.error('Comment form container not found.');
            return;
        }
        commentFormContainer.style.display = 'none';
        // Get the comment content from the form
        const content = document.getElementById('comment').value.trim();
        if (!content) {
            alert('Please enter a comment.'); // Display an alert if the comment is empty
            return;
        }

        // Get the blog post ID from the closest post details element to the submit button
        const postId = submitButton.closest('.post-details').dataset.blogPostId;

        try {
            // Send a POST request to create a new comment
            const response = await fetch('/api/comments/new-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, blogPostId: postId })
            });

            const responseData = await response.json();
            console.log('Server Response:', responseData);

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            // Reset the comment form after successful submission
            document.getElementById('comment').value = ''; // Clear the comment textarea
            console.log('Comment submitted successfully');

            // Handle the response as needed (e.g., display the newly added comment)
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Failed to submit comment. Please try again later.');
        }
    });


    // Function to fetch comments for a specific post
    const fetchCommentsForPost = async (postId) => {
        try {
            const response = await fetch(`api/comments/get-comments/${postId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return []; // Return an empty array if there's an error
        }
    };

    const displayComments = (comments, postId) => {
        const commentsContainer = document.querySelector(`.post-details[data-blog-post-id="${postId}"] .comments-container`);

        console.log(commentsContainer);

        // Clear previous comments
        commentsContainer.innerHTML = '';

        // Iterate over each comment and create HTML elements to display them
        comments.forEach(comment => {
            // Create a div element for each comment
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');

            // Create paragraph elements to display comment content and user information
            const contentParagraph = document.createElement('p');
            contentParagraph.textContent = comment.content;

            const userInfoParagraph = document.createElement('p');
            userInfoParagraph.textContent = `-${comment.user.username}, ${format_date(comment.createdAt)}`;

            // Append paragraphs to the comment div
            commentDiv.appendChild(contentParagraph);
            commentDiv.appendChild(userInfoParagraph);

            // Append the comment div to the comments container
            commentsContainer.appendChild(commentDiv);
        });
    };

    const postDetailsContainers = document.querySelectorAll('.post-details-container');

    // Add event listener to each post details container
    postDetailsContainers.forEach(container => {
        container.addEventListener('click', async () => {
            // Toggle the display of the comments container within the clicked post details container
            console.log('Fired!');
            const commentsContainer = container.querySelector('.comments-container');
            if (commentsContainer) {
                if (commentsContainer.style.display === 'none' || !commentsContainer.style.display) {
                    // Get the post ID from the dataset of the post details element
                    const postId = container.querySelector('.post-details').dataset.blogPostId;

                    // Fetch comments for the post
                    const comments = await fetchCommentsForPost(postId);

                    // Display comments in the comments container
                    displayComments(comments, postId);

                    // Show the comments container
                    commentsContainer.style.display = 'block';
                } else {
                    // Hide the comments container
                    commentsContainer.style.display = 'none';
                }
            }
        });
    });


    // Add an event listener to the comment form to stop propagation
    commentForm.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

