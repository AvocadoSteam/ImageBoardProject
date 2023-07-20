"use strict";

const loadAllImages = async () => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const image = await response.json();
            const i = image.images;

            if (getTagsAsCookie == "") {
                $(".image").append(`<img class="image_content" src="${img.path}">`);
            }
            else {
                for (const img of i) {
                    for (const tag of getTagsAsCookie) {
                        if (img.tags.indexOf(tag) >= 0) {
                            $(".image").append(`<img class="image_content" src="${img.path}">`);
                        }
                    }
                }
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error) {
        console.log("Error retrieving images: ", error);
    }
}

const getTagsAsCookie = JSON.parse(document.cookie
    .split(";")
    .find((row) => row.startsWith(" tags="))?.split("=")[1]);

$(document).ready(async () => {
    await loadAllImages(getTagsAsCookie);
});