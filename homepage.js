"use strict";

$(document).ready(async () => {
    // Clears any search criteria
    sessionStorage.clear();

    // Search's for an image by ID
    $("#image_id_button").click( async () => {
        sessionStorage.setItem("image_id", $("#image_id_text").val())
        location.replace('view_image.html');
    });
    // Search's for images by tag
    $("#lookup-button").click( async () => {
        const tags = $("#topic-id-selection").val().split(" ");
        const filteredTags = tags.filter((tag) => !tag.trim().startsWith("-"));
        sessionStorage.setItem("tags", JSON.stringify(filteredTags));
        location.replace('image_list.html');
    })
});