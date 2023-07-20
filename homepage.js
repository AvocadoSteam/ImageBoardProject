"use strict";

$(document).ready(async () => {
    $("#image_id_button").click( async () => {
        const image_id = $("#image_id_text").val();
        console.log(image_id);
        document.cookie = `image_id=${image_id}; max-age=7200; path=/`; // establishes the image that should be loaded
        location.replace('view_image.html');
    })
});