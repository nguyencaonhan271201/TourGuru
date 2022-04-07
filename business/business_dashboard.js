let offset = 1;

const busID = JSON.parse(localStorage.getItem("business"))
  ? JSON.parse(localStorage.getItem("business")).uid
  : null;

const busType = JSON.parse(localStorage.getItem("business"))
  ? JSON.parse(localStorage.getItem("business")).businessType
    ? "flights"
    : "hotels"
  : null;

const busXHR = JSON.parse(localStorage.getItem("business"))
  ? JSON.parse(localStorage.getItem("business")).businessType
    ? "id"
    : "code"
  : null;

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

function disError() {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    showCloseButton: true,
  });
}

const loadBasicInfo = () => {
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `../api/business/businessDashboard/unapprovedBooking${
      busType[0].toUpperCase() + busType.slice(1)
    }.php?business_${busXHR}=${busID}`,
    true
  );
  xhr.onload = () => {
    if (xhr.status === 200 && xhr.readyState === 4) {
      // console.log(xhr.responseText);
      // document.getElementById("phpResponse").innerHTML = xhr.responseText;
      let result = JSON.parse(xhr.responseText)[0];
      document.getElementById("new-bookings").innerHTML = result.totalBooking;
    }
  };
  xhr.send();
};

function getBookingTrendsChartDatas(period = "W") {
  const getData = () => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (this.status == 200) {
        // document.getElementById("phpResponse").innerHTML = xhr.responseText;
        let result = JSON.parse(this.responseText).reverse();
        bookingChart.data.labels = result.map((data) => {
          if (data.year) return `${data.month}/${data.year}`;
          else if (data.week) return `W${data.week}/${data.month}`;
          else return `${data.day}/${data.month}`;
        });
        bookingChart.data.datasets = [
          {
            label: `${busType[0].toUpperCase() + busType.slice(1)} bookings`,
            data: result.map((data) => data.sum),
            backgroundColor: "#6763a8",
            borderColor: "#6763a8",
          },
        ];
        bookingChart.update();
      } else {
      }
    };
    xhr.open(
      "GET",
      `../api/business/businessDashboard/get${
        busType[0].toUpperCase() + busType.slice(1)
      }BookingsByPeriod.php?business_${busXHR}=${busID}&period=${period}`
    );
    xhr.send();
  };

  getData();
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

function loadTableMore() {
  getTableDatas(++offset);
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

function loadTable(datas) {
  datas.forEach((data) => {
    $(".business_table tbody").append(`
        <tr> 
            <td >${data.bookingID}</td>
            <td>${data.date}</td>
            <td>${data.iterationSummary}</td>
            <td>${data.noOfPax}</td>
            ${tdApprove(data.status)}
            <td class="context-menu" data-container-id="context-menu-items" data-row-type="data"  data-row-id="${
              data.bookingID
            }" data-user-id="${data.userID}"></td>
        </tr>
    `);
  });

  if ($(".business_table tbody .see_more_row").length)
    $(".business_table tbody .see_more_row").remove();
  $(".business_table tbody").append(
    `<tr class="see_more_row" data-type="Flight"><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
}

function getTableDatas(offset = 1) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      // document.getElementById("phpResponse").innerHTML = xhr.responseText;
      let results = JSON.parse(this.responseText);
      if (results.length == 0)
        $(".business_table tbody .see_more_row").remove();
      else loadTable(results);
      catchTable();
    } else {
    }
  };
  xhr.open(
    "GET",
    `../api/business/businessDashboard/booking${
      busType[0].toUpperCase() + busType.slice(1)
    }.php?business_${busXHR}=${busID}&offset=${offset}`
  );
  xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!busID) location.replace("./../");

  $(".booking_trends_chart_options input[type=radio]").on(
    "change",
    function () {
      const { period } = $(this).data();
      console.log(period);
      getBookingTrendsChartDatas(period);
    }
  );

  loadBasicInfo();
  getBookingTrendsChartDatas();
  getTableDatas();
});

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
