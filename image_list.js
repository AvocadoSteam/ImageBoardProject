"use strict";

const loadAllImages = async () => {
    try {
        // Use a relative URL to fetch images.json
        const response = await fetch("/images.json");

        if (response.ok) {
            console.log(response);
            const imageData = await response.json();
            const images = imageData.images;
            const tagsToSearch = getTagsFromStorage();

            let count = 0;
            for (const img of images) {
                console.log(images.length - 1)
                console.log(img.id);
                // Check if the image matches the search criteria (tagsToSearch)
                if (doesImageMatchSearch(img.tags, tagsToSearch)) {
                    if (count === 0) {
                        $("#one").append(`<img class="image_content" src="${img.path}" id="${img.id}">`);
                        count++;
                    } else if (count === 1) {
                        $("#two").append(`<img class="image_content" src="${img.path}" id="${img.id}">`);
                        count++;
                    } else if (count === 2) {
                        $("#three").append(`<img class="image_content" src="${img.path}" id="${img.id}">`);
                        count = 0;
                    }
                }
                else if (sessionStorage.getItem("tags") == '[""]' || sessionStorage.getItem("tags") == null) {
                    if (count == 0) {
                        $("#one").append(`<img class="image_content" src="${img.path}" id="${img.id}">`);
                        count++;
                    } else if (count == 1) {
                        $("#two").append(`<img class="image_content" src="${img.path}" id="${img.id}">`);
                        count++;
                    } else if (count == 2) {
                        $("#three").append(`<img class="image_content" src="${img.path}" id="${img.id}">`);
                        count = 0;
                    }
                }
                if (img.id == images.length) {
                    sessionStorage.setItem("largest_id", img.id);
                }
            }
        } else {
            console.error("Failed to fetch images:", response.status);
        }
    } catch (error) {
        console.error("Error retrieving images: ", error);
    }
};

const addNewImage = async (path, tags) => {
    const new_id = parseInt(sessionStorage.getItem("largest_id")) + 1;
    const bodyContents = JSON.stringify({
        "id": '' + new_id,
        "path": path,
        "tags": tags.split(" ")
    });
    console.log(bodyContents);
    try {
        const response = await fetch("/images.json", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: bodyContents
        });
        response.ok ? await loadAllImages() : console.error("Failed to add image: ", response.status);
        console.log(response.status);
    }
    catch (error) {
        console.error("Error adding new image: ", error);
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
        }
        else {
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
    const tagsToSearch = getTagsFromStorage().join(", ");
    $("#search_criteria").append(`<b>Tags:</b> <i>${tagsToSearch}</i>`);

    $("#add_image").click(async () => {
        // Opens a window
        try {
            const image_link = $("#image_link").val();
            const image_tags = $("#image_tags").val();
            await addNewImage(image_link, image_tags);
        }
        catch (error) {
            console.error("Image failed to post: ", error);
        }
    });

    $(".main_area").on("click", ".image_content", async (e) => {
        let image_id = e.target.id;
        sessionStorage.clear();
        sessionStorage.setItem("image_id", image_id);
        location.replace("view_image.html");
    });
    await loadAllImages();
});
