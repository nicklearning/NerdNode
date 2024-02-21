module.exports = {
    // the helper method 'format_time' will take in a timestamp and return a string with only the time
    format_date: (date) => {
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
    },
};
