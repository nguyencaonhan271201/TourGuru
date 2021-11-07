let uid;
let form = document.getElementById("edit-account-form");
let image = document.querySelector("#edit-account-form #profile-img");
let imageInput = form.querySelector("#profile-img-input");
let errorText = document.querySelector("#error-modal #modal-error-content");
let btnEdit = document.querySelector("#btn-edit-account");
let originalImage = "";

const firebaseConfig = {
    apiKey: "AIzaSyAJj6Z-kMC94FeLTY5aiEZ4NHhAklOcLnU",
    authDomain: "tour-guru-25442.firebaseapp.com",
    projectId: "tour-guru-25442",
    storageBucket: "tour-guru-25442.appspot.com",
    messagingSenderId: "1086343389478",
    appId: "1:1086343389478:web:a40eb9435a26b42a7021e7"
};
  
const firebaseApp = firebase.initializeApp(firebaseConfig);

window.addEventListener("DOMContentLoaded", () => {
    //Check if signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;

            getInfoFromServer();
            Swal.fire({
                title: 'Loading...',
                html: 'Please wait...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading()
                }
            });

            image.addEventListener("click", () => {
                $("#profile-img-input").trigger("click");
            })

            imageInput.addEventListener("change", () => {
                previewFile(imageInput, $(".profile-img"));
            })

            btnEdit.addEventListener("click", (e) => {
                e.preventDefault();
                //$('#loading-modal').modal("show");
                Swal.fire({
                    title: 'Loading...',
                    html: 'Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                    Swal.showLoading()
                    }
                });
                validateAndEditAccount();
            })
        } else {
            location.replace("./../../");
            return;
        }
    })
})

const printInfoToForm = (info) => {
    form.querySelector("#email").value = info["mail"];
    form.querySelector("#display-name").value = info["display-name"]? info["display-name"] : "";
    form.querySelector("#profile-img").src = info["image"];
    originalImage = info["image"];
}

const previewFile = (input, img) => {
    var file = input.files[0];
    if(file){
        var reader = new FileReader();

        reader.onload = function(){
            img.attr("src", reader.result);
        }

        reader.readAsDataURL(file);
    }
}

const getInfoFromServer = () => {
    let csrf = document.getElementById("csrf").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `../../api/profile/edit.php?getProfileInfo&id=${uid}&csrf=${csrf}`,
        true
    )
    xhr.onload = () => {
        Swal.close();
        if (xhr.status === 200 && xhr.readyState === 4) {
           //Nhận thông tin và in ra các ô input
           let result = JSON.parse(xhr.responseText); 
           printInfoToForm(result);
        } else {
            Swal.fire({
                icon: "error",
                text: "1Error occured."
            });
            //location.replace("./../../");
        }
    }
    xhr.send();
}

const validateAndEditAccount = () => {
    //Hide all invalid
    form.querySelectorAll(".invalid-text").forEach(input => {
        if (input.classList.contains("show")) {
            input.classList.remove("show");
        }
    })

    form.querySelectorAll("div div input").forEach(input => {
        if (input.classList.contains("wrong-input")) {
            input.classList.remove("wrong-input");
        }
    })

    //Get info
    let displayName = form.querySelector("#display-name").value;

    if (displayName.length === 0) {
        swal.close();
        Swal.fire({
            icon: "error",
            text: "Display name cannot be blank."
        });
        let displayNameInvalid = form.querySelector("#display-name-invalid");
        let displayNameInput = form.querySelector("#display-name");
        if (!displayNameInvalid.classList.contains("opacity-1"))
            displayNameInvalid.classList.add("opacity-1");
        if (!displayNameInput.classList.contains("wrong-input"))
            displayNameInput.classList.add("wrong-input");
        return;
    }

    let csrf = document.getElementById("csrf").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/profile/edit.php",
        true
    )
    xhr.onload = () => {
        swal.close();
        if (xhr.status === 200 && xhr.readyState === 4) {
            console.log(xhr.responseText);
            let result = JSON.parse(xhr.responseText);
            if (result["resultCode"] == 0) {
                //Success
                //Navigate to home page
                location.replace("./../../");
            }
            if (result["resultCode"] == 1) {
                    errorText.innerHTML = "";
                    if (result["error"]["displayName"] != null) {
                        let displayNameInvalid = form.querySelector("#display-name-invalid");
                        let displayNameInput = form.querySelector("#display-name");
                        if (!displayNameInvalid.classList.contains("opacity-1"))
                            displayNameInvalid.classList.add("opacity-1");
                        if (!displayNameInput.classList.contains("wrong-input"))
                            displayNameInput.classList.add("wrong-input");
                        errorText.innerHTML += "\r\n" + result["error"]["displayName"];
                    }
                    if (result["error"]["image"] != null) {
                        let imageInvalid = form.querySelector("#profile-image-invalid");
                        if (!imageInvalid.classList.contains("opacity-1"))
                            imageInvalid.classList.add("opacity-1");
                        errorText.innerHTML += "\r\n" +  result["error"]["image"];
                    }

                    Swal.fire({
                        icon: "error",
                        text: errorText.innerHTML
                    });
            }
        } else {
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again."
            });
        }
    }
    
    let formData = new FormData();
    formData.append("editProfileInfo", true);
    formData.append("id", uid);
    formData.append("csrf", csrf);
    formData.append("displayName", displayName);
    if (imageInput.value != "") {
        formData.append("image", imageInput.files[0]);
    }
    xhr.send(formData);
}