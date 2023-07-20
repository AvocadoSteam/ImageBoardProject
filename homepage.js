"use strict";

$(document).ready(async () => {
    // Creates a cookie to let view_image know which image_id is being accessed
    $("#image_id_button").click( async () => {
        const image_id = $("#image_id_text").val();
        document.cookie = `image_id=${image_id}; max-age=7200; path=/`; // establishes the image that should be loaded
        location.replace('view_image.html');
    });
    $("#lookup-button").click( async () => {
        const tags = $("#topic-id-selection").val();
        const tagsAsCookie = JSON.stringify(tags.split(","));
        document.cookie = `tags=${tagsAsCookie}; max-age=7200; path=/`; // establishes the image that should be loaded
        location.replace('image_list.html');
    })
});