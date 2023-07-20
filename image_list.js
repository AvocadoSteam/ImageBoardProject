"use strict";

const loadAllImages = async () => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const image = await response.json();
            const i = image.images;

            if (getTagsFromStorage == "" || getTagsFromStorage == null) {
                $(".image").append(`<img class="image_content" src="${img.path}">`);
            }
            else {
                for (const img of i) {
                    for (const tag of getTagsFromStorage) {
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

const getTagsFromStorage = JSON.parse(sessionStorage.getItem("tags"))

$(document).ready(async () => {
    await loadAllImages(getTagsFromStorage);
    $("#search_criteria").append(`<b>Tags:</b> <i>${getTagsFromStorage}</i>`);
});