function nav_template() {
  return `
    <nav>
      <div class="nav nav-tabs justify-content-end" id="nav-tab" role="tablist">
        <button class="nav-link active" id="nav-ans-tab" data-bs-toggle="tab" data-bs-target="#nav-ans" type="button" role="tab" aria-controls="nav-ans" aria-selected="true">Answered</button>
        <button class="nav-link" id="nav-una-tab" data-bs-toggle="tab" data-bs-target="#nav-una" type="button" role="tab" aria-controls="nav-una" aria-selected="false">Unanswered</button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-ans" role="tabpanel" aria-labelledby="nav-ans-tab"></div>
      <div class="tab-pane fade" id="nav-una" role="tabpanel" aria-labelledby="nav-una-tab"></div>
    </div>
    `;
}

function quenstionForm_template(user_name = "", user_img = "") {
  return `
    <div class="card m-3">
      <div class="card-body">
          <div class="d-flex align-items-center ">
              <img src="${user_img.replace("../../../", "../../")}" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
              <div>
                  <a><h3>${user_name ? user_name : ""}</h3></a>
              </div>
          </div>
          <div class="px-3">
            <form id="question_form">
              <textarea rows="5" class="w-100 p-2" name="text"></textarea>
              <button class="btn btn-outline-primary btn-sm rounded-pill" type="submit"><i class="bi bi-arrow-up"></i></button>
            </form>                        
          </div>
      </div>
    </div>

    <div id="nav-ans">
    
    </div>
    `;
}

function unaQuestionCard_template(question, business) {
  console.log(question, business);
  if (question.businessID == busID) {
    return `<div class="card m-3">
    <div class="card-body">
        <div class="d-flex align-items-center">
            <img src="${question.userIMG.replace("../../../", "../../")}" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
            <div>
                <a href=""><h3>${question.userName}</h3></a>
                <h4>asked a question on ${question.time}</h4>
            </div>
        </div>
        <p class="card-text">${question.text}</p>

        <div class="ms-5">
          <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img src="${business.busIMG.replace("../../../", "../../")}" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
                    <div>
                        <a><h3>${business.busName}</h3></a>
                    </div>
                </div>
                <div class="px-3">
                  <form class="answer_form" data-question_id="${question.questionID}">
                    <textarea rows="5"  class="w-100" name="text" "></textarea>
                    <button class="btn btn-outline-primary btn-sm rounded-pill" type="submit" ><i class="bi bi-arrow-up"></i></button>
                  </form>                        
                </div>
            </div>
          </div>
        </div>
    </div>
      </div>`;
  } else
    return `<div class="card m-3">
  <div class="card-body">
      <div class="d-flex align-items-center">
          <img src="${question.userIMG.replace("../../../", "../../")}" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
            <div>
                <a href=""><h3>${question.userName}</h3></a>
                <h4>asked a question on ${question.time}</h4>
            </div>
      </div>
        <p class="card-text">${question.text}</p>
      </div>
      </div>`;
}

function ansQuestionCard_template(question) {
  return `<div class="card m-3">
    <div class="card-body">
        <div class="d-flex align-items-center">
            <img src="${
              question.userIMG
            }" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
            <div>
                <a href=""><h3>${question.userName}</h3></a>
                <h4>asked a question on ${question.time}</h4>
            </div>
        </div>
        <p class="card-text">${question.text}</p>
  
        ${repCard_template(question.answer)}
    </div>
  </div>`;
}

function repCard_template(answers) {
  let html = ``;
  answers.forEach((answer) => {
    html += `<div class="ms-5">
  <div class="card">
    <div class="card-body">
        <div class="d-flex align-items-center">
            <img src="${answer.businessIMG.replace("../../../", "../../")}" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
            <div>
                <a href=""><h3>${answer.userName}</h3></a>
                <h4>answered on ${answer.time}</h4>
            </div>
        </div>
        <p class="card-text"> ${answer.text}</p>
    </div>
  </div>
</div>`;
  });
  return html;
}
