"use strict";
const makePost = async (contents) => {
    const bodyContents = JSON.stringify({
        "contents": contents
    });
    try {
        const response = await fetch("http://localhost:8080/view_image.html", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: bodyContents
        });
        console.log(fetch);
        console.log(response);
        if (response.ok) {
            // If the response is successful, add the comment to the comments section
            $("<p>").text(contents).appendTo('.comments');
        } else {
            // Handle errors if the response is not successful
            console.error("Failed to post comment:", response.status);
        }
    } catch (error) {
        // Handle any other errors that may occur during the POST request
        console.error("Error occurred while posting comment:", error);
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
