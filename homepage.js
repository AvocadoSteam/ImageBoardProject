"use strict";

$(document).ready(async () => {
    sessionStorage.setItem("add_image", "true");
    // Creates a cookie to let view_image know which image_id is being accessed
    $("#image_id_button").click( async () => {
        sessionStorage.setItem("image_id", $("#image_id_text").val())
        location.replace('view_image.html');
    });
    $("#lookup-button").click( async () => {
        const tags = $("#topic-id-selection").val().split(" ");
        const filteredTags = tags.map(tag => tag.trim().toLowerCase());
        sessionStorage.setItem("tags", JSON.stringify(filteredTags));
        location.replace('image_list.html');
    })
});