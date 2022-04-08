const busID = JSON.parse(localStorage.getItem("business"))
  ? JSON.parse(localStorage.getItem("business")).businessID
  : null;

const busCN = JSON.parse(localStorage.getItem("headerInfo"))
  ? JSON.parse(localStorage.getItem("headerInfo")).businessCode
    ? JSON.parse(localStorage.getItem("headerInfo")).businessCode
    : JSON.parse(localStorage.getItem("headerInfo")).businessName
  : null;

const busType = JSON.parse(localStorage.getItem("business"))
  ? JSON.parse(localStorage.getItem("headerInfo")).businessType === 0
    ? "flights"
    : "hotels"
  : null;

const busXHR = JSON.parse(localStorage.getItem("business"))
  ? JSON.parse(localStorage.getItem("headerInfo")).businessType === 0
    ? "code"
    : "name"
  : null;

let offset = 1;

const userID = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user")).uid
  : null;

const userName = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user")).displayName
  : null;

const userImg = JSON.parse(localStorage.getItem("headerInfo"))
  ? JSON.parse(localStorage.getItem("headerInfo")).image
  : "https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde";

function sendQuestion(curBusType, curBusCN, curBusXHR, userID, text) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    `../../api/business/businessQuestion/${curBusType}Question.php`
  );
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.responseText);
      location.reload();
    }
  };
  xhr.send(`business_${curBusXHR}=${curBusCN}&userID=${userID}&text=${text}`);
}

function catchQuestionForm(curBusType, curBusCN, curBusXHR) {
  $("#question_form").submit(function (event) {
    event.preventDefault();
    if (!userID) location.replace("./../auth/login.php");
    else {
      sendQuestion(
        curBusType,
        curBusCN,
        curBusXHR,
        userID,
        $(this)
          .serializeArray()
          .find((i) => i.name == "text").value
      );
    }
  });
}

function sendAnswer(questionID, text) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `../../api/business/businessQuestion/${busType}Answer.php`);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.responseText);
      //location.reload();
    }
  };
  xhr.send(`qID=${questionID}&business_${busXHR}=${busCN}&text=${text}`);
}

function catchAnswerForm() {
  $(".answer_form").submit(function (event) {
    event.preventDefault();
    sendAnswer(
      $(this).attr("data-question_id"),
      $(this)
        .serializeArray()
        .find((i) => i.name == "text").value
    );
  });
}

function processQuestions(questions, ans, una = ans) {
  questions.forEach((question) => {
    console.log(question);
    if (!question.answer.length) {
      una.prepend(unaQuestionCard_template(question, busID));
    } else {
      ans.prepend(ansQuestionCard_template(question));
    }
  });

  catchAnswerForm();
}

function loadQuestions(curBusType, curBusCN, curBusXHR, ans, una = ans) {
  let xhr = new XMLHttpRequest();

  xhr.open(
    "GET",
    `../../api/business/businessQuestion/${curBusType}Question.php?business_${curBusXHR}=${curBusCN}&offset=${offset}`,
    true
  );
  xhr.onload = () => {
    swal.close();
    if (xhr.status === 200 && xhr.readyState === 4) {
      // console.log(this.responseText);
      // document.getElementById("phpResponse").innerHTML = xhr.responseText;
      let result = JSON.parse(xhr.responseText);
      processQuestions(result, ans, una);
      // processQuestions(
      //   [{ isAnswered: true }, { id: 11, isAnswered: false, business_id: 1 }],
      //   ans,
      //   una
      // );
    } else {
      Swal.fire({
        icon: "error",
        text: "Error occured.",
      }).then(() => {
        location.replace("./../");
      });
    }
  };
  xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
  //không có ID & có logged in as business hoặc link có code/name là đã đang logged in
  if (
    (!(
      new URL(window.location.href).searchParams.get("code") ||
      new URL(window.location.href).searchParams.get("name")
    ) &&
      busCN) ||
    (busCN &&
      (new URL(window.location.href).searchParams.get("code") == busCN ||
        new URL(window.location.href).searchParams.get("name") == busCN))
  ) {
    $("#qDiv").prepend(nav_template());
    loadQuestions(busType, busCN, busXHR, $("#nav-ans"), $("#nav-una"));
  }
  //link có ID
  else if (
    new URL(window.location.href).searchParams.get("code") ||
    new URL(window.location.href).searchParams.get("name")
  ) {
    let curBusType = new URL(window.location.href).searchParams.get("code")
      ? "flights"
      : new URL(window.location.href).searchParams.get("name")
      ? "hotels"
      : "";
    let curBusCN = new URL(window.location.href).searchParams.get("code")
      ? new URL(window.location.href).searchParams.get("code")
      : new URL(window.location.href).searchParams.get("name");
    let curBusXHR = new URL(window.location.href).searchParams.get("code")
      ? "code"
      : new URL(window.location.href).searchParams.get("name")
      ? "name"
      : "";

    if (!busID) {
      $("#qFormDiv").prepend(quenstionForm_template(userName, userImg));
      catchQuestionForm(curBusType, curBusCN, curBusXHR);
    }

    loadQuestions(curBusType, curBusCN, curBusXHR, $("#qDiv"));
  } else location.replace("./../../");
});
