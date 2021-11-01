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
        } else {
            location.replace("./../../");
            return;
        }
    })

    getInfoFromServer();
    $("#loading-modal").modal("show");

    image.addEventListener("click", () => {
        $("#profile-img-input").trigger("click");
    })

    imageInput.addEventListener("change", () => {
        console.log("aloha");
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
})

const printInfoToForm = (info) => {
    form.querySelector("#email").value = info["email"];
    form.querySelector("#display-name").value = info["display-name"];
    form.querySelector("#profile-img").src = info["image"];
    originalImage = info["image"];
}

const previewFile = (input, img) => {
    console.log(input);
    console.log(img);
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
        "/api/profile/edit.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        swal.close();
        if (this.status === 200 && this.readyState === 4) {
           //Nhận thông tin và in ra các ô input
           let result = JSON.parse(this.responseText); 
           printInfoToForm(result);
        } else {
            //errorText.innerHTML = "Error occured.";
            //$('#sign-up-error-modal').modal("show");
            Swal.fire({
                icon: "error",
                text: "Error occured."
            });
            location.replace("./../../");
        }
        //$('#loading-modal').modal("hide");
    }
    xhr.send(`getProfileInfo&id=${uid}&csrf=${csrf}`);
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

    let csrf = document.getElementById("csrf").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "/api/profile/edit.php",
        true
    )
    xhr.onreadystatechange = () => {
        swal.close();
        if (this.status === 200 && this.readyState === 4) {
           let result = JSON.parse(this.responseText);
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

                //$('#sign-up-error-modal').modal("show");
                Swal.fire({
                    icon: "error",
                    text: errorText.innerHTML
                });
           }
           
        } else {
            //errorText.innerHTML = "Error occured. Please try again";
            //$('#sign-up-error-modal').modal("show");
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again."
            });
        }
        //$('#loading-modal').modal("hide");
    }
    
    let formData = new FormData();
    formData.append("editProfileInfo", true);
    formData.append("id", uid);
    formData.append("csrf", csrf);
    formData.append("displayName", displayName);
    if (fileInput.value != "") {
        imageInput.append("image", imageInput.files[0]);
    }
    xhr.send(formData);
}