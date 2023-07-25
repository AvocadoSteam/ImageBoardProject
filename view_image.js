"use strict";

/***
 * Creates a comment on an image
 * @param name name of person posting
 * @param contents comment body
 */
const makePost = async (name, contents) => {
    const bodyContents = JSON.stringify({
        "image_id": sessionStorage.getItem("image_id"),
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

/***
 * Updates the comments section
 */
const refreshComments = async () => {
    try {
        // Use a relative URL to fetch comments.json
        const response = await fetch("/comments.json");

        if (response.ok) {
            const commentsData = await response.json();
            const comments = commentsData.comments;
            console.log(comments);

            // Clear the existing comments
            $(".comments").empty();

            // Append each comment to the comments section
            for (const commentObj of comments) {
                if (commentObj.image_id == sessionStorage.getItem("image_id")) {
                    $(".comments").append(`<p style="font-size:20px;"><b>${commentObj.name}:</b> ${commentObj.text}</p>`);
                }
                //$("<p>").text("<b>" + commentObj.name + ":</b>" + commentObj.text).appendTo('.comments');
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.error("Error occurred while fetching comments:", error);
    }
};
/*
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
*/
/***
 * Refreshes the image on the page
 * @param image_id id of image to display
 */
const refreshImage = async (image_id) => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const image = await response.json();
            const i = image.images;

            // Load image with specified ID
            for (const img of i) {
                if (img["id"] == image_id) { // replace 1 with image_id
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

$("#lookup-button").click( async () => {

    const tags = $("#topic-id-selection").val().split(" ");
    //const tagsAsCookie = JSON.stringify(tags.split(","));
    const filteredTags = tags.filter((tag) => !tag.trim().startsWith("-"));

    sessionStorage.setItem("tags", JSON.stringify(filteredTags));
    //document.cookie = `tags=${tagsAsCookie}; max-age=7200; path=/`; // establishes the image that should be loaded
    location.replace('image_list.html');
})

// https://developer.mozilla.org/en-US/docs/web/api/document/cookie
// Retrieves value from a cookie to grab the image_id of the desired image for display

$(document).ready(async () => {
    await refreshComments();
    await refreshImage(sessionStorage.getItem("image_id"));
});
