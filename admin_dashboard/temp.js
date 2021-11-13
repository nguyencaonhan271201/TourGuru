let tempHotelBookings = [
  {
    bookingNo: "23",
    hotelName: "newWorld",
    from: "10/10/10",
    to: "11/11/11",
    userID: "12",
    mail: "test@gmail.com",
    timeBooked: "19/10/21",
  },
  {
    bookingNo: "30",
    hotelName: "Kashima",
    from: "10/10/10",
    to: "11/11/11",
    userID: "12",
    mail: "test2@gmail.com",
    timeBooked: "20/10/21",
  },
];

let tempFlightBookings = [
  {
    bookingNo: "23",
    from: "Hawaii",
    to: "Los Angeles",
    userID: "12",
    mail: "test@gmail.com",
    departure: "11/21/90",
    timeBooked: "19/10/21",
  },
  {
    bookingNo: "79",
    from: "Portugal",
    to: "Lisbon",
    userID: "15",
    mail: "test2@gmail.com",
    departure: "11/21/90",
    timeBooked: "19/10/21",
  },
];

let tempUsers = [
  {
    userID: "15",
    userName: "Hakota",
    mail: "test@gmail.com",
    timeCreated: "19/10/21",
  },
  {
    userID: "20",
    userName: "fniwdofnw",
    mail: "test3@gmail.com",
    timeCreated: "19/10/21 9AM",
  },
];

let tempFY = [
  { year: 2021, month: 10, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 9, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 8, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 7, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 6, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 5, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 4, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 3, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 2, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 1, sum: Math.floor(Math.random() * 101) },
  { year: 2020, month: 12, sum: Math.floor(Math.random() * 101) },
  { year: 2020, month: 11, sum: Math.floor(Math.random() * 101) },
  { year: 2020, month: 10, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempFQ = [
  { month: 10, week: 4, sum: Math.floor(Math.random() * 101) },
  { month: 10, week: 3, sum: Math.floor(Math.random() * 101) },
  { month: 10, week: 2, sum: Math.floor(Math.random() * 101) },
  { month: 10, week: 1, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 4, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 3, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 2, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 1, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 4, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 3, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 2, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 1, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempFM = [
  { month: 10, day: 27, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 26, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 25, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 24, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 23, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 22, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 21, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 20, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 19, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 18, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 17, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 16, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 15, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 14, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 13, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 12, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 11, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 10, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 9, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 8, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 7, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 6, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 5, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 4, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 3, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 2, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 1, sum: Math.floor(Math.random() * 101) },
  { month: 9, day: 30, sum: Math.floor(Math.random() * 101) },
  { month: 9, day: 29, sum: Math.floor(Math.random() * 101) },
  { month: 9, day: 28, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempFW = [
  { month: 10, day: 27, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 26, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 25, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 24, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 23, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 22, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 21, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempHY = [
  { year: 2021, month: 10, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 9, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 8, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 7, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 6, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 5, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 4, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 3, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 2, sum: Math.floor(Math.random() * 101) },
  { year: 2021, month: 1, sum: Math.floor(Math.random() * 101) },
  { year: 2020, month: 12, sum: Math.floor(Math.random() * 101) },
  { year: 2020, month: 11, sum: Math.floor(Math.random() * 101) },
  { year: 2020, month: 10, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempHQ = [
  { month: 10, week: 4, sum: Math.floor(Math.random() * 101) },
  { month: 10, week: 3, sum: Math.floor(Math.random() * 101) },
  { month: 10, week: 2, sum: Math.floor(Math.random() * 101) },
  { month: 10, week: 1, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 4, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 3, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 2, sum: Math.floor(Math.random() * 101) },
  { month: 9, week: 1, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 4, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 3, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 2, sum: Math.floor(Math.random() * 101) },
  { month: 8, week: 1, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempHM = [
  { month: 10, day: 27, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 26, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 25, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 24, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 23, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 22, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 21, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 20, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 19, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 18, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 17, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 16, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 15, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 14, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 13, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 12, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 11, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 10, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 9, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 8, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 7, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 6, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 5, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 4, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 3, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 2, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 1, sum: Math.floor(Math.random() * 101) },
  { month: 9, day: 30, sum: Math.floor(Math.random() * 101) },
  { month: 9, day: 29, sum: Math.floor(Math.random() * 101) },
  { month: 9, day: 28, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempHW = [
  { month: 10, day: 27, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 26, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 25, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 24, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 23, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 22, sum: Math.floor(Math.random() * 101) },
  { month: 10, day: 21, sum: Math.floor(Math.random() * 101) },
].reverse();

let tempVY = [
  { zone: "Europe", sum: Math.floor(Math.random() * 50001) },
  { zone: "Asia", sum: Math.floor(Math.random() * 50001) },
  { zone: "America", sum: Math.floor(Math.random() * 50001) },
  { zone: "Africa", sum: Math.floor(Math.random() * 50001) },
];

let tempVQ = [
  { zone: "Europe", sum: Math.floor(Math.random() * 25001) },
  { zone: "Asia", sum: Math.floor(Math.random() * 25001) },
  { zone: "America", sum: Math.floor(Math.random() * 25001) },
  { zone: "Africa", sum: Math.floor(Math.random() * 25001) },
];

let tempVM = [
  { zone: "Europe", sum: Math.floor(Math.random() * 5001) },
  { zone: "Asia", sum: Math.floor(Math.random() * 5001) },
  { zone: "America", sum: Math.floor(Math.random() * 5001) },
  { zone: "Africa", sum: Math.floor(Math.random() * 5001) },
];

let tempVW = [
  { zone: "Europe", sum: Math.floor(Math.random() * 501) },
  { zone: "Asia", sum: Math.floor(Math.random() * 501) },
  { zone: "America", sum: Math.floor(Math.random() * 501) },
  { zone: "Africa", sum: Math.floor(Math.random() * 501) },
];
