const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["May", "June", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Flights booking",
        data: [100, 150, 220, 280, 310, 320],
      },
      {
        label: "Hotel booking",
        data: [300, 400, 500, 600, 700, 800],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const ctx2 = document.getElementById("myChart2").getContext("2d");
const myChart2 = new Chart(ctx2, {
  type: "pie",
  data: {
    labels: ["Asia", "Europe", "NorthAmerica"],
    datasets: [
      {
        data: [1020, 4008, 10304],
      },
    ],
  },
});

function loadFlightTable(flights) {
  flights.forEach((flight) => {
    $(".flight_table tbody").append(`
        <tr> 
            <td>${flight.bookingNo}</td>
            <td>${flight.from}</td>
            <td>${flight.to}</td>
            <td>${flight.mail}</td>
            <td>${flight.departure}</td>
            <td>${flight.timeBooked}</td>
            <td class="context-menu" data-container-id="context-menu-items" data-row-id="${flight.bookingNo}"></td>
        </tr>
    `);
  });

  $(".flight_table tbody").append(
    `<tr><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
}

function loadHotelTable(hotels) {
  hotels.forEach((hotel) => {
    $(".hotel_table tbody").append(`
          <tr>
              <td>${hotel.bookingNo}</td>
              <td>${hotel.hotelName}</td>
              <td>${hotel.from}</td>
              <td>${hotel.to}</td>
              <td>${hotel.mail}</td>
              <td>${hotel.timeBooked}</td>              
              <td class="context-menu" data-container-id="context-menu-items" data-row-id="${hotel.bookingNo}"></td>
          </tr>
      `);
  });

  $(".hotel_table tbody").append(
    `<tr><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
}

function loadUserTable(users) {
  users.forEach((user) => {
    $(".user_table tbody").append(`
      <tr>
          <td>${user.userName}</td>
          <td>${user.mail}</td>
          <td>${user.timeCreated}</td>                  
          <td class="context-menu" data-container-id="context-menu-items" data-row-id="${user.userID}"></td>
      </tr>
    `);
  });
  $(".user_table tbody").append(
    `<tr><td colspan="100%" class="text-center opacity-25">See more</td></tr>`
  );
}

loadFlightTable(tempFlightBookings);
loadHotelTable(tempHotelBookings);
loadUserTable(tempUsers);
let tableContextMenu = new ContextMenu(
  `context-menu-items`,
  (menu_item, parent) => {
    alert(
      "Menu Item Clicked: " +
        menu_item.text() +
        "\nRecord ID: " +
        parent.attr("data-row-id")
    );
  }
);
