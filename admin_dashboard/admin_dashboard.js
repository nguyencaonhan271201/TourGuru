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

const ctx2 = document.getElementById("myChart2").getContext("2d");
let visitedChart = new Chart(ctx2, {
  type: "pie",
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
        bookingChart.update();

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

function getVisitedTrendsChartDatas(period = "W") {
  let tempV;
  switch (period) {
    case "W": {
      tempV = tempVW;
      break;
    }
    case "M": {
      tempV = tempVM;
      break;
    }
    case "Q": {
      tempV = tempVQ;
      break;
    }
    case "Y": {
      tempV = tempVY;
      break;
    }
  }

  visitedChart.data = {
    labels: tempV.map((data) => data.zone),
    datasets: [
      {
        data: tempV.map((data) => data.sum),
        backgroundColor: tinycolor("#6763a8")
          .tetrad()
          .map((color) => color.toHexString()),
        hoverOffset: 10,
      },
    ],
  };

  visitedChart.update();
}

function getFlightTableDatas(offset = 1) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      if (results.length == 0) $(".flight_table tbody .see_more_row").remove();
      else loadFlightTable(results);
      cacthTable();
    } else {
    }
  };
  xhr.open("GET", `../api/dashboard/flightsBookingInfo.php?offset=${offset}`);
  xhr.send();
}

function getHotelTableDatas(offset = 1) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      if (results.length == 0) $(".hotel_table tbody .see_more_row").remove();
      else loadHotelTable(results);
      cacthTable();
    } else {
    }
  };
  xhr.open("GET", `../api/dashboard/hotelsBookingInfo.php?offset=${offset}`);
  xhr.send();
}

function getUserTableDatas(offset = 1) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      if (results.length == 0) $(".user_table tbody .see_more_row").remove();
      else loadUserTable(results);
      cacthTable();
      Swal.close();
    } else {
    }
  };
  xhr.open("GET", `../api/dashboard/usersInfo.php?offset=${offset}`);
  xhr.send();
}

function cacthTable() {
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
      console.log($(this).data().type);
      loadTableMore($(this).data().type);
    });
}

function loadFlightTable(flights) {
  flights.forEach((flight) => {
    $(".flight_table tbody").append(`
        <tr> 
            <td>${flight.bookingNo}</td>
            <td>${flight.from}</td>
            <td>${flight.to}</td>
            <td>${new Date(flight.timeBooked).addHours(7).toLocaleString()}</td>
            <td class="context-menu" data-container-id="context-menu-items" data-row-type="Flight"  data-row-id="${
              flight.bookingNo
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

function loadHotelTable(hotels) {
  console.log("hotel catched");
  hotels.forEach((hotel) => {
    $(".hotel_table tbody").append(`
          <tr>
              <td>${hotel.bookingNo}</td>
              <td>${hotel.hotelName}</td>
              <td>${hotel.from}</td>
              <td>${hotel.to}</td>
              <td>${new Date(hotel.timeBooked)
                .addHours(7)
                .toLocaleString()}</td>              
              <td class="context-menu" data-container-id="context-menu-items" data-row-type="Hotel" data-row-id="${
                hotel.bookingNo
              }" data-user-id="${hotel.userID}"></td>
          </tr>
      `);
  });

  if ($(".hotel_table tbody .see_more_row").length)
    $(".hotel_table tbody .see_more_row").remove();
  $(".hotel_table tbody").append(
    `<tr class="see_more_row" data-type="Hotel"><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
}

function loadUserTable(users) {
  users.forEach((user) => {
    $(".user_table tbody").append(`
      <tr>
          <td>${user.userName}</td>
          <td>${user.mail}</td>
          <td>${new Date(user.timeCreated)
            .addHours(7)
            .toLocaleString()}</td>                  
          <td class="context-menu" data-container-id="context-menu-items" data-row-type="User" data-row-id="${
            user.userID
          }"></td>
      </tr>
    `);
  });

  if ($(".user_table tbody .see_more_row").length)
    $(".user_table tbody .see_more_row").remove();
  $(".user_table tbody").append(
    `<tr class="see_more_row" data-type="User"><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
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

function getSpecific(type, id) {
  if (type.rowType === "Flight") {
    location.replace(`./flight?id=${type.rowId}`);
  } else if (type.rowType === "Hotel") {
    location.replace(`./hotel?id=${type.rowId}`);
  }
}

function deleteSpecific({ rowType: type, userId, rowId: Id }) {
  console.log(type);
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
  Swal.fire({
    title: "Loading...",
    html: "Please wait...",
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      if (isAdmin) {
        loadBasicInfo(user.uid);
        getBookingTrendsChartDatas();
        getVisitedTrendsChartDatas();

        $(".booking_trends_chart_options input[type=radio]").on(
          "change",
          function () {
            const { period } = $(this).data();
            getBookingTrendsChartDatas(period);
            getVisitedTrendsChartDatas(period);
          }
        );

        getFlightTableDatas();
        getHotelTableDatas();
        getUserTableDatas();
      } else {
        location.replace("./../auth/login.php");
      }
    } else {
      location.replace("./../auth/login.php");
      return;
    }
  });
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
        //location.replace("./../");
      });
    }
  };
  xhr.send();
};

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
