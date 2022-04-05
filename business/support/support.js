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

//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       if (isAdmin) {
//         loadBasicInfo(user.uid);
//         getBookingTrendsChartDatas();
//         getVisitedTrendsChartDatas();

//         $(".booking_trends_chart_options input[type=radio]").on(
//           "change",
//           function () {
//             const { period } = $(this).data();
//             getBookingTrendsChartDatas(period);
//             getVisitedTrendsChartDatas(period);
//           }
//         );

//         getFlightTableDatas();
//         getHotelTableDatas();
//         getUserTableDatas();
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

function processQuestions(questions, all, una = all) {
  questions.forEach((question) => {
    if (!question.isAnswered) {
      html = `<div class="card m-3">
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
                <div class="p-3">
                  </form>
                    <textarea class="w-100"></textarea>
                    <button class="btn btn-outline-primary btn-sm rounded-pill">post</button>
                  <form>                        
                </div>
            </div>
          </div>
        </div>
    </div>
      </div>`;
      una.prepend(html);
    } else {
      html = `<div class="card m-3">
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
    </div>
      `;
      all.prepend(html);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (
    !JSON.parse(localStorage.getItem("headerInfo")) ||
    !JSON.parse(localStorage.getItem("headerInfo")).isBusiness
  ) {
    console.log("user");
    $("body>div").prepend(`
    <div class="card m-3">
      <div class="card-body">
          <div class="d-flex align-items-center ">
              <img src="https://firebasestorage.googleapis.com/v0/b/cs204finalproj.appspot.com/o/istockphoto-1223671392-612x612.jpg?alt=media&amp;token=e9312c19-c34e-4a87-9a72-552532766cde" class="rounded-circle m-3" height="22" alt="" loading="lazy" id="profile-img">
              <div>
                  <a><h3>waseydified</h3></a>
              </div>
          </div>
          <div class="p-3">
            </form>
              <textarea class="w-100"></textarea>
              <button class="btn btn-outline-primary btn-sm rounded-pill">post</button>
            <form>                        
          </div>
      </div>
    </div>

    <div id="nav-all">
    
    </div>
    `);

    processQuestions(
      [{ isAnswered: true }, { isAnswered: false }],
      $("#nav-all")
    );
  } else if (JSON.parse(localStorage.getItem("headerInfo")).isBusiness) {
    $("body>div").prepend(`
    <nav>
      <div class="nav nav-tabs justify-content-end" id="nav-tab" role="tablist">
        <button class="nav-link active" id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All</button>
        <button class="nav-link" id="nav-una-tab" data-bs-toggle="tab" data-bs-target="#nav-una" type="button" role="tab" aria-controls="nav-una" aria-selected="false">Unanswered</button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      <div class="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab"></div>
      <div class="tab-pane fade" id="nav-una" role="tabpanel" aria-labelledby="nav-una-tab"></div>
    </div>
    `);

    processQuestions(
      [{ isAnswered: true }, { isAnswered: false }],
      $("#nav-all"),
      $("#nav-una")
    );
  }
});

//TODO: Sửa prototype
