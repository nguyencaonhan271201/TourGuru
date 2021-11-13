let form = document.getElementById("reset-password-form");
let errorText = document.querySelector("#error-modal #modal-error-content");
let btnReset = document.querySelector("#btn-reset-pass-submit");

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
    btnReset.addEventListener("click", (e) => {
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
        resetPassword();
    })
})

const resetPassword = () => {
    swal.close();
    let auth = firebase.auth();
    let email = document.querySelector("#reset-password-email").value;

    if (email == "") {
        //errorText.innerHTML = "Please type in your email.";
        //$('#error-modal').modal("show");
        Swal.fire({
            icon: "error",
            text: "Please type in your email."
        });
    } else {
        auth.sendPasswordResetEmail(email)
        .then(() => {
            //errorText.innerHTML = "Please check your email to reset your password.";
            //$('#error-modal').modal("show");
            Swal.fire({
                icon: "success",
                title: "Your request has been accepted.",
                text: "Please check your email to reset your password."
            });
        })
        .catch((error) => {    
            if (error.code === "auth/user-not-found") {
                //errorText.innerHTML = "Account not found. Please check and try again.";
                //$('#error-modal').modal("show");
                Swal.fire({
                    icon: "error",
                    text: "Account not found. Please check and try again."
                });
            }
            else if (error.code === "auth/invalid-email") {
                //errorText.innerHTML = "Invalid email. Please check and try again.";
                //$('#error-modal').modal("show");
                Swal.fire({
                    icon: "error",
                    text: "Invalid email. Please check and try again."
                });
            }
            else {
                //errorText.innerHTML = error.message;
                //$('#error-modal').modal("show");
                Swal.fire({
                    icon: "error",
                    text: error.message
                });
            }
        })
    }

    

    //$('#loading-modal').modal("hide");
}

