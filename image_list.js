"use strict";

const loadAllImages = async () => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const image = await response.json();
            const i = image.images;
            console.log(i);

            for (const img of i) {
                $(".image").append(`<img class="image_content" src="${img.path}">`);
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.log("Error retrieving images: ", error);
    }
}

$(document).ready(async () => {
    await loadAllImages();
});