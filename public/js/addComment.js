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
    const addCommentButton = document.querySelector('.add-comment-button');
    const commentForm = document.getElementById('comment-form');
    const submitButton = commentForm.querySelector('button[type="submit"]');

    // Add an event listener to the button
    addCommentButton.addEventListener('click', () => {
        // Logic to handle when the button is clicked
        console.log('Add Comment button clicked');

        // For example, you can show/hide the comment form
        const commentForm = document.getElementById('comment-form');
        if (commentForm.style.display === 'none') {
            commentForm.style.display = 'block';
        } else {
            commentForm.style.display = 'none';
        }
    });
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the comment content from the form
        const content = document.getElementById('comment').value.trim();
        if (!content) {
            alert('Please enter a comment.'); // Display an alert if the comment is empty
            return;
        }

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

    // Other code...
});