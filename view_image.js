"use strict";

const makePost = async (name, contents) => {
    const bodyContents = JSON.stringify({
        "name": name,
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
                $("<p>").text(commentObj.name + ": " + commentObj.text).appendTo('.comments');
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.error("Error occurred while fetching comments:", error);
    }
};

const getImage = async (id, path, tags) => {
    const bodyContents = JSON.stringify({
        "id": id,
        "path": path,
        "tags": [tags]
    });
    try {
        const response = await fetch("http://localhost:8080/view_image.js", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
            body: bodyContents
        });

        if (response.ok) {
            // If the response is successful, refresh the comments section to display the updated comments
            await refreshImage();
        } else {
            // Handle errors if the response is not successful
            console.error("Failed to post comment:", response.status);
        }
    } catch (error) {
        // Handle any other errors that may occur during the POST request
        console.error("Error occurred while posting comment:", error);
    }
}

const refreshImage = async (image_id) => {
    try {
        // Use a relative URL to fetch comments.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const image = await response.json();
            const i = image.images;
            console.log(i);

            // Clear the existing comments
            //$(".image").empty();

            // Append each comment to the comments section
            //document.getElementById("page_image").src = path;
            for (const img of i) {
                if (img["id"] == 1) { // replace 1 with image_id
                    console.log(img["id"]);
                    console.log(img.path)
                    $("#page_image").attr("src", img.path);
                }
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.error("Error occurred while fetching comments:", error);
    }
}

// Add event listener to the "Post Comment" button
$("#post-comment-button").click(async () => {
    try {
        const name = $("#post-comment-name").val();
        const comment = $("#post-comment-comment").val();
        await makePost(name, comment);
    } catch (error) {
        console.log("Error:", error);
    }
});


$(document).ready(async () => {
    await refreshComments();
    await refreshImage();
});
