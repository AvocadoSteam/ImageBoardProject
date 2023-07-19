"use strict";

const makePost = async (contents) => {
    const bodyContents = JSON.stringify({
        "contents": contents
    });
    try {
        const response = await fetch("http://localhost:8080/view_image.js", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: bodyContents
        });

        if (response.ok) {
            // If the response is successful, refresh the comments section to display the updated comments
            await refreshComments();
        } else {
            // Handle errors if the response is not successful
            console.error("Failed to post comment:", response.status);
        }
    } catch (error) {
        // Handle any other errors that may occur during the POST request
        console.error("Error occurred while posting comment:", error);
    }
};

// Function to refresh the comments section
const refreshComments = async () => {
    try {
        // Use a relative URL to fetch comments.json
        const response = await fetch("/comments.json");

        if (response.ok) {
            const commentsData = await response.json();
            const comments = commentsData.comments;

            // Clear the existing comments
            $(".comments").empty();

            // Append each comment to the comments section
            for (const commentObj of comments) {
                $("<p>").text(commentObj.text).appendTo('.comments');
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.error("Error occurred while fetching comments:", error);
    }
};

// Add event listener to the "Post Comment" button
$("#post-comment-button").click(async () => {
    try {
        const comment = $("#post-comment-comment").val();
        await makePost(comment);
    } catch (error) {
        console.log("Error:", error);
    }
});


$(document).ready(async () => {
    await refreshComments();
});
