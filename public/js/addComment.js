document.addEventListener('DOMContentLoaded', () => {
    const postDetails = document.querySelectorAll('.post-details');
    const commentForm = document.querySelector('.comment-form');
    let blogPostId = null;

    postDetails.forEach(post => {
        post.addEventListener('click', () => {
            blogPostId = post.dataset.blogPostId;
            commentForm.style.display = 'block';
        });
    });

    const commentFormSubmit = commentForm.querySelector('#comment-form');
    const submitButton = commentFormSubmit.querySelector('button[type="submit"]');

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const formData = new FormData(commentFormSubmit);
        const content = formData.get('content');

        try {
            const response = await fetch('/api/comments/new-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, blogPostId })
            });
            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            // Optionally, you can handle the response here
            console.log('Comment submitted successfully');

            // Reset the form after submission
            const commentFormElement = document.getElementById('comment-form');
            commentFormElement.reset();

            // Hide the comment form
            commentForm.style.display = 'none';
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    });

});