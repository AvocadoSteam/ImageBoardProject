"use strict";

const loadAllImages = async () => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const image = await response.json();
            const i = image.images;
            let count = 0;
            const tagsToSearch = getTagsFromStorage();
            console.log(sessionStorage.getItem("tags"));
            //if (sessionStorage.getItem("tags") == '[""]' || sessionStorage.getItem("tags") == null) {
            for (const img of i) {
                if (sessionStorage.getItem("tags") == '[""]' || sessionStorage.getItem("tags") == null) {
                    if (count == 0) {
                        $("#one").append(`<img src="${img.path}">`);
                        count++;
                    } else if (count == 1) {
                        $("#two").append(`<img src="${img.path}">`);
                        count++;
                    } else if (count == 2) {
                        $("#three").append(`<img src="${img.path}">`);
                        count = 0;
                    }
                } else if (doesImageMatchSearch(img.tags, tagsToSearch)) {
                    if (count === 0) {
                        $("#one").append(`<img src="${img.path}">`);
                        count++;
                    } else if (count === 1) {
                        $("#two").append(`<img src="${img.path}">`);
                        count++;
                    } else if (count === 2) {
                        $("#three").append(`<img src="${img.path}">`);
                        count = 0;
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

const getTagsFromStorage = () => {
    const tags = sessionStorage.getItem("tags");
    return tags ? JSON.parse(tags) : [];
};

const doesImageMatchSearch = (imageTags, searchTags) => {
    // Separate tags into included and excluded lists based on '-' prefix
    const includedTags = [];
    const excludedTags = [];
    searchTags.forEach(tag => {
        if (tag.startsWith("-")) {
            excludedTags.push(tag.substring(1));
        } else {
            includedTags.push(tag);
        }
    });

    // Check if any of the excluded tags are present in the imageTags
    if (excludedTags.some(tag => imageTags.includes(tag))) {
        return false;
    }

    // Check if all included tags are present in the imageTags
    return includedTags.every(tag => imageTags.includes(tag));
};

$("#lookup-button").click(async () => {
    const tags = $("#topic-id-selection").val().split(" ").map(tag => tag.trim());
    //const tagsAsCookie = JSON.stringify(tags.split(","));
    const filteredTags = tags.filter((tag) => tag && !tag.startsWith("-"));

    sessionStorage.setItem("tags", JSON.stringify(filteredTags));
    //document.cookie = `tags=${tagsAsCookie}; max-age=7200; path=/`; // establishes the image that should be loaded
    location.replace('image_list.html');
})
/*
const getTagsFromStorage = JSON.parse(document.cookie
    .split(";")
    .find((row) => row.startsWith(" tags="))?.split("=")[1]);
*/


$(document).ready(async () => {
    await loadAllImages();
    const tagsToSearch = getTagsFromStorage().join(", ");
    $("#search_criteria").append(`<b>Tags:</b> <i>${tagsToSearch}</i>`);
});