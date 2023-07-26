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

            let count = 0;
            console.log(sessionStorage.getItem("tags"));
            if (sessionStorage.getItem("tags") == '[""]' || sessionStorage.getItem("tags") == null) {
                for (const img of i) {
                    if (count == 0) {
                        $("#one").append(`<img src="${img.path}">`);
                        count++;
                    }
                    else if (count == 1) {
                        $("#two").append(`<img src="${img.path}">`);
                        count++;
                    }
                    else if (count == 2) {
                        $("#three").append(`<img src="${img.path}">`);
                        count = 0;
                    }
                }
            }
            else {
                for (const img of i) {
                    for (const tag of getTagsFromStorage) {
                        if (img.tags.indexOf(tag) >= 0) {
                            if (count === 0) {
                                $("#one").append(`<img src="${img.path}">`);
                                count++;
                            }
                            else if (count === 1) {
                                $("#two").append(`<img src="${img.path}">`);
                                count++;
                            }
                            else if (count === 2) {
                                $("#three").append(`<img src="${img.path}">`);
                                count = 0;
                            }
                        }
                    }
                }
            }
        } else {
            console.error("Failed to fetch comments:", response.status);
        }
    } catch (error); {
        console.log("Error retrieving images: ", error);
    }
}


/*
const getTagsFromStorage = JSON.parse(document.cookie
    .split(";")
    .find((row) => row.startsWith(" tags="))?.split("=")[1]);
*/

const getTagsFromStorage = JSON.parse(sessionStorage.getItem("tags"))
$("#lookup-button").click( async () => {
    const tags = $("#topic-id-selection").val().split(" ");
    //const tagsAsCookie = JSON.stringify(tags.split(","));
    const filteredTags = tags.filter((tag) => !tag.trim().startsWith("-"));

    sessionStorage.setItem("tags", JSON.stringify(filteredTags));
    //document.cookie = `tags=${tagsAsCookie}; max-age=7200; path=/`; // establishes the image that should be loaded
    location.replace('image_list.html');
})
/*
const getTagsFromStorage = JSON.parse(document.cookie
    .split(";")
    .find((row) => row.startsWith(" tags="))?.split("=")[1]);
*/
// const getTagsFromStorage = JSON.parse(sessionStorage.getItem("tags"))

$(document).ready(async () => {
    await loadAllImages(getTagsFromStorage);
    $("#search_criteria").append(`<b>Tags:</b> <i>${getTagsFromStorage}</i>`);
})};