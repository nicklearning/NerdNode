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
        const commentsContainer = document.querySelector('.comments-container');
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


    // Add click event listener to post details elements
    document.querySelectorAll('.post-details').forEach(post => {
        post.addEventListener('click', async () => {
            const postId = post.dataset.blogPostId;
            const comments = await fetchComments(postId);
            displayComments(comments);
        });
    });
});
