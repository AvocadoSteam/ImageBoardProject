"use strict";

const loadAllImages = async () => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            const imageData = await response.json();
            const images = imageData.images;
            const tagsToSearch = getTagsFromStorage();

            let count = 0;
            for (const img of images) {
                // Check if the image matches the search criteria (tagsToSearch)
                if (doesImageMatchSearch(img.tags, tagsToSearch)) {
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
                } else if (sessionStorage.getItem("tags") == '[""]' || sessionStorage.getItem("tags") == null) {
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
                }
            }
        }else {
            console.error("Failed to fetch images:", response.status);
        }
    } catch (error) {
        console.log("Error retrieving images: ", error);
    }
};

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
    const tags = $("#topic-id-selection").val().split(" ");
    const filteredTags = tags.map(tag => tag.trim().toLowerCase());

    sessionStorage.setItem("tags", JSON.stringify(filteredTags));
    location.replace('image_list.html');
});

$(document).ready(async () => {
    await loadAllImages();
    const tagsToSearch = getTagsFromStorage().join(", ");
    $("#search_criteria").append(`<b>Tags:</b> <i>${tagsToSearch}</i>`);
});
