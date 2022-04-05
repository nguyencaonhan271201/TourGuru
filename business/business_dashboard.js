let flightOffset = 1;
let hotelOffset = 1;
let userOffset = 1;

const ctx = document.getElementById("myChart").getContext("2d");
let bookingChart = new Chart(ctx, {
  type: "line",
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function getBookingTrendsChartDatas(period = "W") {
  const getFlights = () => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status == 200) {
        let result = JSON.parse(this.responseText).reverse();
        bookingChart.data.labels = result.map((data) => {
          if (data.year) return `${data.month}/${data.year}`;
          else if (data.week) return `W${data.week}/${data.month}`;
          else return `${data.day}/${data.month}`;
        });
        bookingChart.data.datasets = [
          {
            label: "Flights bookings",
            data: result.map((data) => data.sum),
            backgroundColor: "#6763a8",
            borderColor: "#6763a8",
          },
        ];
        getHotels();
      } else {
      }
    };
    xhr.open(
      "GET",
      `../api/dashboard/totalFlightsBooking.php?period=${period}`
    );
    xhr.send();
  };

  const getHotels = () => {
    const xhr2 = new XMLHttpRequest();
    xhr2.onload = function () {
      if (this.status == 200) {
        let result = JSON.parse(this.responseText).reverse();
        bookingChart.data.datasets.push({
          label: "Hotels bookings",
          data: result.map((data) => data.sum),
          backgroundColor: tinycolor("#6763a8").complement().toHexString(),
          borderColor: tinycolor("#6763a8").complement().toHexString(),
        });
        bookingChart.update();
      } else {
      }
    };
    xhr2.open(
      "GET",
      `../api/dashboard/totalHotelsBooking.php?period=${period}`
    );
    xhr2.send();
  };

  getFlights();
}

function getFlightTableDatas(offset = 1) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      if (results.length == 0) $(".flight_table tbody .see_more_row").remove();
      else loadFlightTable(results);
      catchTable();
    } else {
    }
  };
  xhr.open("GET", `../api/dashboard/flightsBookingInfo.php?offset=${offset}`);
  xhr.send();
}

function loadBusinessTable(flights) {
  flights.forEach((flight) => {
    $(".business_table tbody").append(`
        <tr> 
            <td >${flight.bookingID}</td>
            <td>${flight.date}</td>
            <td>${flight.iterationSummary}</td>
            <td>${flight.noOfPax}</td>
            ${tdApprove(flight.status)}
            <td class="context-menu" data-container-id="context-menu-items" data-row-type="Flight"  data-row-id="${
              flight.bookingID
            }" data-user-id="${flight.userID}"></td>
        </tr>
    `);
  });

  if ($(".flight_table tbody .see_more_row").length)
    $(".flight_table tbody .see_more_row").remove();
  $(".flight_table tbody").append(
    `<tr class="see_more_row" data-type="Flight"><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
}

function tdApprove(value) {
  if (parseInt(value) == 2)
    return `<td class="green text-center ">approved</td>`;
  else if (parseInt(value) == 1)
    return `<td class="red text-center ">rejected</td>`;
  else
    return `
    <td>
      <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
        <button class="d-block text-center accordion-button collapsed p-0" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
          pending
        </button>

        <div id="flush-collapseOne" class="accordion-collapse collapse pt-2" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body d-flex justify-content-around align-items-center p-0">
            <div class="pending green-bordered rounded-circle d-flex justify-content-center align-items-center m-0"><i class="bi bi-check-lg green"></i></div>
            <div class="pending reject red-bordered rounded-circle d-flex justify-content-center align-items-center m-0"><i class="bi bi-x-lg red"></i></div>
          </div>
        </div>
      </div>
    </td>
  `;
}

function catchTable() {
  let tableContextMenu = new ContextMenu(
    `context-menu-items`,
    (menu_item, parent) => {
      if (menu_item.data().choice == "view") {
        getSpecific(parent.data());
      } else if (menu_item.data().choice == "delete") {
        deleteSpecific(parent.data());
      }
    }
  );

  $(".see_more_row")
    .off("click")
    .on("click", function () {
      loadTableMore($(this).data().type);
    });

  $(".accordion-flush").hover(
    function () {
      $(this).find("button.accordion-button").click();
    },
    function () {
      if ($(this).find(".accordion-collapse").hasClass("show"))
        $(this).find("button.accordion-button").click();
    }
  );

  $(".accordion .pending").on("click", function () {
    if ($(this).hasClass("green-bordered")) {
      Swal.fire({
        title: `Approve this booking?`,
        showCancelButton: true,
        confirmButtonText: "Approve",
        reverseButtons: true,
        cancelButtonColor: "#6763a8",
        confirmButtonColor: "#00c2b1",
      }).then((result) => {
        if (result.isConfirmed) {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "POST",
            // `../api/dashboard/delete${
            //   type == "User" ? type : type + "Booking"
            // }.php`,
            true
          );
          xhr.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
          );
          xhr.onload = function () {
            if (this.status == 200) {
              if (this.responseText === "1") {
                $(`.${type.toLowerCase()}_table td[data-row-id="${Id}"]`)
                  .parent()
                  .remove();
              } else disError();
            } else disError();
          };
          xhr.send(`userID=${userId}&ID=${Id}`);
        }
      });
    } else if ($(this).hasClass("red-bordered")) {
      Swal.fire({
        title: `Reject this booking?`,
        showCancelButton: true,
        confirmButtonText: "Reject",
        reverseButtons: true,
        cancelButtonColor: "#6763a8",
        confirmButtonColor: "#c95998",
      });
    }
  });
}

function loadTableMore(type) {
  switch (type) {
    case "Flight": {
      getFlightTableDatas(++flightOffset);
      break;
    }
    case "Hotel": {
      getHotelTableDatas(++hotelOffset);
      break;
    }
    case "User": {
      getUserTableDatas(++userOffset);
      break;
    }
  }
}

function disError() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    showCloseButton: true,
  });
}

function getSpecific(type) {
  if (type.rowType === "Flight") {
    location.replace(`./flight?id=${type.rowId}`);
  } else if (type.rowType === "Hotel") {
    location.replace(`./hotel?id=${type.rowId}`);
  } else if (type.rowType === "User") {
    Swal.fire({
      title: `${type.name}`,
      html: `
          <div>
            <img alt="" src="${type.image}" class="view-user-img" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%;">
            <div class="text-left mt-4" style="margin: 0 auto;">
              <h5 style="color: black; width: fit-content;">Email: ${type.email}</h5>
              <h5 style="color: black; width: fit-content;">Created: ${type.created}</h5>
              <h5 style="color: black; width: fit-content;">Flight Bookings: ${type.flight}</h5>
              <h5 style="color: black; width: fit-content;">Hotel Bookings: ${type.hotel}</h5>
              <h5 style="color: black; width: fit-content;">Visited Locations: ${type.location}</h4>
            </div>
          </div>
          `,
    });
  }
}

function deleteSpecific({ rowType: type, userId, rowId: Id }) {
  Swal.fire({
    title: `Confirm delete ${type.toLowerCase()} #${Id} ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    reverseButtons: true,
    cancelButtonColor: "#6763a8",
    confirmButtonColor: "#c95998",
  }).then((result) => {
    if (result.isConfirmed) {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `../api/dashboard/delete${
          type == "User" ? type : type + "Booking"
        }.php`,
        true
      );
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (this.status == 200) {
          if (this.responseText === "1") {
            $(`.${type.toLowerCase()}_table td[data-row-id="${Id}"]`)
              .parent()
              .remove();
          } else disError();
        } else disError();
      };
      xhr.send(`userID=${userId}&ID=${Id}`);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  {
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
  }

  loadBusinessTable(tempFlightBookings);
  catchTable();
});

const loadBasicInfo = (uid) => {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `../api/dashboard/generalInfo.php?user_id=${uid}&isAdmin=${isAdmin}`,
    true
  );
  xhr.onload = () => {
    swal.close();
    if (xhr.status === 200 && xhr.readyState === 4) {
      //Nhận thông tin và lưu vào danh mục
      let result = JSON.parse(xhr.responseText);
      document.getElementById("total-flight").innerHTML = result.flight;
      document.getElementById("total-hotel").innerHTML = result.hotel;
      document.getElementById("total-visited").innerHTML = result.visited;
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
};

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
