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
              <img src="${user_img}" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
              <div>
                  <a><h3>${user_name ? user_name : ""}</h3></a>
              </div>
          </div>
          <div class="px-3">
            <form id="question_form">
              <textarea rows="5" class="w-100" name="text"></textarea>
              <button class="btn btn-outline-primary btn-sm rounded-pill" type="submit"><i class="bi bi-arrow-up"></i></button>
            </form>                        
          </div>
      </div>
    </div>

    <div id="nav-ans">
    
    </div>
    `;
}

function unaQuestionCard_template(question, busID) {
  console.log(question, busID);
  if (question.business_id == busID) {
    return `<div class="card m-3">
    <div class="card-body">
        <div class="d-flex align-items-center">
            <img src="https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
            <div>
                <a><h3>waseydified</h3></a>
                <h4>asked a question on April 2019</h4>
            </div>
        </div>
        <p class="card-text">I gave 200,000 dong to donate to their cause and paid for our coffee and treated her to lunch and the grab around the area. It is better to pay everything in saigon in dong coz they stop accepting USD in any area other than district 1</p>

        <div class="ms-5">
          <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
                    <div>
                        <a><h3>vietnamairlines</h3></a>
                    </div>
                </div>
                <div class="px-3">
                  <form class="answer_form" data-question_id="${question.id}">
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
          <img src="https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
          <div>
              <a><h3>waseydified</h3></a>
              <h4>asked a question on April 2019</h4>
          </div>
      </div>
      <p class="card-text">I gave 200,000 dong to donate to their cause and paid for our coffee and treated her to lunch and the grab around the area. It is better to pay everything in saigon in dong coz they stop accepting USD in any area other than district 1</p>
      </div>
      </div>`;
}

function ansQuestionCard_template(question) {
  return `<div class="card m-3">
    <div class="card-body">
        <div class="d-flex align-items-center">
            <img src="https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
            <div>
                <a><h3>waseydified</h3></a>
                <h4>asked a question on April 2019</h4>
            </div>
        </div>
        <p class="card-text">I gave 200,000 dong to donate to their cause and paid for our coffee and treated her to lunch and the grab around the area. It is better to pay everything in saigon in dong coz they stop accepting USD in any area other than district 1</p>
  
        <div class="ms-5">
          <div class="card">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
                    <div>
                        <a><h3>vietnamairlines</h3></a>
                        <h4>answered on April 2019</h4>
                    </div>
                </div>
                <p class="card-text">I gave 200,000 dong to donate to their cause and paid for our coffee and treated her to lunch and the grab around the area. It is better to pay everything in saigon in dong coz they stop accepting USD in any area other than district 1</p>
            </div>
          </div>
        </div>
    </div>
  </div>`;
}
