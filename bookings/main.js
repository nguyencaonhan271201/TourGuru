let uid;

let flightsDiv = document.querySelector(".flights-bookings");
let hotelsDiv = document.querySelector(".hotels-bookings");
let navHotel = document.querySelector("#nav-hotel");
let navFlight = document.querySelector("#nav-flight");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let availableBookings = {
    flights: {},
    hotels: [],
};

document.addEventListener('DOMContentLoaded', () => {
    Swal.fire({
        title: 'Loading...',
        html: 'Please wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
    });
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            loadBookings();
        } else {
            location.replace("./../auth/login.php");
            return;
        }
    })

    navHotel.addEventListener("click", () => {
        chooseHotel();
    })

    navFlight.addEventListener("click", () => {
        chooseFlight();
    })

    
})

const chooseFlight = () => {
    if (!navFlight.classList.contains("active")) {
        navFlight.classList.add("active");
    }
    if (navHotel.classList.contains("active")) {
        navHotel.classList.remove("active");
    }
    hotelsDiv.style.display = "none";
    flightsDiv.style.display = "block";
}

const chooseHotel = () => {
    if (!navHotel.classList.contains("active")) {
        navHotel.classList.add("active");
    }
    if (navFlight.classList.contains("active")) {
        navFlight.classList.remove("active");
    }
    hotelsDiv.style.display = "block";
    flightsDiv.style.display = "none";
}

const getDisplayDateFormat = (isWeekDay, ISODate) => {
    const newDateObj = new Date(ISODate);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    const DOW = newDateObj.getDay()
    const dateTemplate = isWeekDay? `${weekDays[DOW]}, ${toDate} ${months[toMonth - 1]} ${toYear}` : `${toDate} ${months[toMonth - 1]} ${toYear}`;
    // console.log(dateTemplate)
    return dateTemplate;
}

const getShortDisplayDateFormat = (ISODate) => {
    const newDateObj = new Date(ISODate);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    return `${toDate}/${toMonth}/${toYear}`;
}

const loadBookings = () => {
    const getAvailableFlightBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../api/plans/create.php?getFlightBookings&id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
               //Nhận thông tin và lưu vào danh mục
               let result = JSON.parse(xhr.responseText); 
               result.forEach(iteration => {
                    if (!Object.keys(availableBookings.flights).includes(iteration.booking_id.toString())) {
                        availableBookings.flights[iteration.booking_id] = [];
                        availableBookings.flights[iteration.booking_id].push(iteration);
                    } else {
                        availableBookings.flights[iteration.booking_id].push(iteration);
                    }
               })
               getAvailableHotelBookings();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                }).then(() => {
                    location.replace("./../");
                })
            }
        }
        xhr.send();
    }

    const getAvailableHotelBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../api/plans/create.php?getHotelBookings&id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                availableBookings.hotels = result;

                loadToTables();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                }).then(() => {
                    location.replace("./../");
                })
            }
        }
        xhr.send();
    }
    
    getAvailableFlightBookings();

    //dummyData();

    //loadToTables();
}

//Testing only
const dummyData = () => {
    availableBookings = {
        hotels: [
            {
                'id': 1,
                'user_id': 1,
                'date_start': '2021-11-18',
                'date_end': '2021-11-20',
                'number_of_nights': 2,
                'hotel_id': 12345,
                'hotel_name': 'Bulgari Hotel London',
                'hotel_image_url': 'https://pix10.agoda.net/hotelImages/4880829/228078015/97f70b1331c0e8d7ba87e1b478c8a6ff.jpg?s=1024x768',
                'status': 1,
                'number_of_beds': 1,
                'date_booked': '22:12 - 03/11/2021',
                'total_cost': '2646.12 EUR',
            }
        ],
        flights: {
            1: [
                {
                    'id': 1,
                    'booking_id': 1,
                    'origin_code': 'FCO',
                    'dest_code': 'LHR',
                    'origin': 'Leonardo Da Vinci - Fiumicino Airport',
                    'destination': 'Heathrow Airport',
                    'departure': '07:30',
                    'arrival': '09:30',
                    'date': '2021-11-18',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321neo',
                    'airline': 'British Airways',
                    'flight_number': 'BA551',
                    'number_of_pax': 2,
                    'total_price': '1114.542 EUR',
                    'date_booked': '22:12 - 03/11/2021'
                }, {
                    'id': 2,
                    'booking_id': 1,
                    'origin_code': 'LHR',
                    'dest_code': 'FCO',
                    'origin': 'Heathrow Airport',
                    'destination': 'Leonardo Da Vinci - Fiumicino Airport',
                    'departure': '07:25',
                    'arrival': '10:55',
                    'date': '2021-11-20',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321',
                    'airline': 'ITA Italia Trasporto Aereo (Alitalia)',
                    'flight_number': 'AZ201',
                    'number_of_pax': 2,
                    'total_price': '1114.542 EUR',
                    'date_booked': '22:12 - 03/11/2021'
                }
            ],
            2: [
                {
                    'id': 1,
                    'booking_id': 2,
                    'origin_code': 'FCO',
                    'dest_code': 'LHR',
                    'origin': 'Leonardo Da Vinci - Fiumicino Airport',
                    'destination': 'Heathrow Airport',
                    'departure': '07:30',
                    'arrival': '09:30',
                    'date': '2021-11-18',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321neo',
                    'airline': 'British Airways',
                    'flight_number': 'BA551',
                    'number_of_pax': 2,
                    'total_price': '1114.542 EUR',
                    'date_booked': '22:12 - 03/11/2021'
                }, {
                    'id': 2,
                    'booking_id': 2,
                    'origin_code': 'LHR',
                    'dest_code': 'FCO',
                    'origin': 'Heathrow Airport',
                    'destination': 'Leonardo Da Vinci - Fiumicino Airport',
                    'departure': '07:25',
                    'arrival': '10:55',
                    'date': '2021-11-20',
                    'class': 'BUSINESS',
                    'aircraft': 'Airbus A321',
                    'airline': 'ITA Italia Trasporto Aereo (Alitalia)',
                    'flight_number': 'AZ201',
                    'number_of_pax': 2,
                    'total_price': '1114.542 EUR',
                    'date_booked': '22:12 - 03/11/2021'
                }
            ]
        }
    }
}

const loadToTables = () => {
    swal.close();

    let html = ``;
    Object.keys(availableBookings.flights).forEach(key => {
        let bookingDetail = availableBookings.flights[key];
        let iterationDiv = ``;
        if (bookingDetail.length === 2) {
            iterationDiv = `
                <div>
                    <div>
                        <img src="http://pics.avs.io/50/30/${bookingDetail[0]["flight_number"].substring(0, 2)}.png">
                        ${bookingDetail[0]["flight_number"]}: ${bookingDetail[0]["origin_code"]} - ${bookingDetail[0]["dest_code"]} 
                        (${bookingDetail[0]["departure"]} - ${bookingDetail[0]["arrival"]}) 
                    </div>
                    <div>
                        <img src="http://pics.avs.io/50/30/${bookingDetail[1]["flight_number"].substring(0, 2)}.png">
                        ${bookingDetail[1]["flight_number"]}: ${bookingDetail[1]["origin_code"]} - ${bookingDetail[1]["dest_code"]} 
                        (${bookingDetail[1]["departure"]} - ${bookingDetail[1]["arrival"]}) 
                    </div>
                </div>
            `
        } else {
            iterationDiv = `
            <div>
                <div>
                    <img src="http://pics.avs.io/50/30/${bookingDetail[0]["flight_number"].substring(0, 2)}.png">
                    ${bookingDetail[0]["flight_number"]}: ${bookingDetail[0]["origin_code"]} - ${bookingDetail[0]["dest_code"]} 
                    (${bookingDetail[0]["departure"]} - ${bookingDetail[0]["arrival"]}) 
                </div>
            </div>
        `
        }
        html += `
            <tr>
                <td>
                    ${getDisplayDateFormat(false, bookingDetail[0]["date"])}
                </td>
                <td>
                    ${iterationDiv}
                </td>
                <td>
                    ${bookingDetail[0]["class"]}
                </td>
                <td>
                    ${bookingDetail[0]["number_of_pax"]}
                </td>
                <td>
                    ${bookingDetail[0]["total_price"]}
                </td>
                <td>
                    ${getDisplayDateFormatAdd7Hours(bookingDetail[0]["date_booked"])}
                </td>
                <td>
                    <a type="button" class="btn btn-info btn-view-booking btn-view-booking-flight" data-booking-id=${bookingDetail[0]["booking_id"]}>View</a>
                </td>
            </tr>
        `
    })
    flightsDiv.querySelector("tbody").innerHTML = html;

    html = '';
    availableBookings.hotels.forEach(booking => {
        let nightOrNights = booking.number_of_nights == 1? "night" : "nights";
        html += `
            <tr>
                <td>
                    ${getShortDisplayDateFormat(booking.date_start)} - ${getShortDisplayDateFormat(booking.date_end)}
                    <br>
                    (${booking.number_of_nights} ${nightOrNights})
                </td>
                <td>
                    ${booking.number_of_beds}
                </td>
                <td>
                    <div>
                        <img style="max-height: 100px; max-width: 100px; object-fit: contain;" alt="" 
                        src="${booking.hotel_image_url}">
                        <br>
                        ${booking.hotel_name}
                    </div>
                </td>
                <td>
                    ${booking.total_cost}
                </td>
                <td>
                    ${getDisplayDateFormatAdd7Hours(booking.date_booked)}
                </td>
                <td>
                    <a type="button" class="btn btn-info btn-view-booking btn-view-booking-hotel" data-booking-id=${booking.id}>View</a>
                </td>
            </tr>
        `
    })
    hotelsDiv.querySelector("tbody").innerHTML = html;

    document.querySelectorAll(".btn-view-booking-flight").forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-booking-id");
            location.replace(`./flight?id=${id}`);
        })
    })

    document.querySelectorAll(".btn-view-booking-hotel").forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.getAttribute("data-booking-id");
            location.replace(`./hotel?id=${id}`);
        })
    })

    chooseFlight();
}

const getDisplayDateFormatAdd7Hours = (ISODate) => {
    function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }

    let newDateObj = new Date(ISODate);
    newDateObj = addHoursToDate(newDateObj, 7);
    const toMonth = newDateObj.getMonth() + 1;
    const toYear = newDateObj.getFullYear();
    const toDate = newDateObj.getDate();
    const DOW = newDateObj.getDay()
    const dateTemplate = `${toDate} ${months[toMonth - 1]} ${toYear}`;
    return dateTemplate;
}