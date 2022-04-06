const busID = new URL(window.location.href).searchParams.get("code")
  ? new URL(window.location.href).searchParams.get("code")
  : new URL(window.location.href).searchParams.get("name");

const busType = new URL(window.location.href).searchParams.get("code")
  ? "flights"
  : new URL(window.location.href).searchParams.get("name")
  ? "hotels"
  : "";

const busXHR = new URL(window.location.href).searchParams.get("code")
  ? "code"
  : new URL(window.location.href).searchParams.get("name")
  ? "name"
  : "";

const userImg = JSON.parse(localStorage.getItem("headerInfo"))
  ? JSON.parse(localStorage.getItem("headerInfo")).image
  : "https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde";

let userID, userName;

// document.addEventListener("DOMContentLoaded", () => {
//   Swal.fire({
//     title: "Loading...",
//     html: "Please wait...",
//     allowEscapeKey: false,
//     allowOutsideClick: false,
//     didOpen: () => {
//       Swal.showLoading();
//     },
//   });

//   const loadBasicInfo = (uid) => {
//     let xhr = new XMLHttpRequest();
//     xhr.open(
//       "GET",
//       `../../api/dashboard/generalInfo.php?user_id=${uid}&isAdmin=${isAdmin}`,
//       true
//     );
//     xhr.onload = () => {
//       swal.close();
//       if (xhr.status === 200 && xhr.readyState === 4) {
//       } else {
//         Swal.fire({
//           icon: "error",
//           text: "Error occured.",
//         }).then(() => {
//           location.replace("./../");
//         });
//       }
//     };
//     xhr.send();
//   };

//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       if (isAdmin) {
//         loadBasicInfo(user.uid);
//       } else {
//         location.replace("./../auth/login.php");
//       }
//     } else {
//       location.replace("./../auth/login.php");
//       return;
//     }
//   });

//   if ($(window).width() <= 768) $(".outline-1").fitText(1.2);
// });

$(window).on("load", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userID = user.uid;
    } else {
      return;
    }
  });
});

function processQuestions(questions, ans, una = ans) {
  questions.forEach((question) => {
    if (!question.isAnswered) {
      una.prepend(
        unaQuestionCard_template(
          question,
          JSON.parse(localStorage.getItem("business")),
          busID
        )
      );
    } else {
      ans.prepend(
        ansQuestionCard_template(
          question,
          JSON.parse(localStorage.getItem("business")),
          busID
        )
      );
    }
  });
}

function catchQuestionForm() {
  $("#question_form").submit(function (event) {
    event.preventDefault();
    if (!userID) location.replace("./../auth/login.php");
    else {
      sendQuestion(
        $(this)
          .serializeArray()
          .find((i) => i.name == "text").value
      );
    }
  });
}

function sendQuestion(text) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `../../api/bussiness/businessQuestion/${busType}Question.php`
  );
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.responseText);
      //location.reload();
    }
  };
  xhr.send(`userID=${userID}&business_${busXHR}=${busID}&text=${text}`);
}

function sendAnswer(questionID, text) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `../../api/bussiness/businessQuestion/${busType}Answer.php`);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.responseText);
      //location.reload();
    }
  };
  xhr.send(`questionID=${questionID}&business_${busXHR}=${busID}&text=${text}`);
}

function catchAnswerForm() {
  $(".answer_form").submit(function (event) {
    event.preventDefault();
    sendAnswer(
      $(this)
        .serializeArray()
        .find((i) => i.name == "text").value
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  //user
  if (
    !JSON.parse(localStorage.getItem("headerInfo")) ||
    !JSON.parse(localStorage.getItem("headerInfo")).isBusiness
  ) {
    $("body>div.container-fluid").prepend(
      quenstionForm_template(userName, userImg)
    );

    processQuestions(
      [{ isAnswered: true }, { isAnswered: false }],
      $("#nav-ans")
    );
  }
  //business
  else if (JSON.parse(localStorage.getItem("headerInfo")).isBusiness) {
    $("body>div.container-fluid").prepend(nav_template());

    processQuestions(
      [{ isAnswered: true }, { isAnswered: false }],
      $("#nav-ans"),
      $("#nav-una")
    );
  }
  catchQuestionForm();
  catchAnswerForm();
});

//TODO: Sửa prototype
