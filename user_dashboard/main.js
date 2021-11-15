let uid;

let flightsDiv = document.querySelector(".flights-bookings");
let hotelsDiv = document.querySelector(".hotels-bookings");
let visitedDiv = document.querySelector(".visited-location-div");
let navHotel = document.querySelector("#nav-subpart-hotel");
let navFlight = document.querySelector("#nav-subpart-flight");
let navVisited = document.querySelector("#nav-visited");

let visitedLocations = [];

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

    navVisited.addEventListener("click", () => {
        chooseVisited();
    })
})

const chooseFlight = () => {
    if (!navFlight.classList.contains("active")) {
        navFlight.classList.add("active");
    }
    if (navVisited.classList.contains("active")) {
        navVisited.classList.remove("active");
    }
    if (navHotel.classList.contains("active")) {
        navHotel.classList.remove("active");
    }
    hotelsDiv.style.display = "none";
    flightsDiv.style.display = "block";
    visitedDiv.style.display = "none";
}

const chooseHotel = () => {
    if (!navHotel.classList.contains("active")) {
        navHotel.classList.add("active");
    }
    if (navFlight.classList.contains("active")) {
        navFlight.classList.remove("active");
    }
    if (navVisited.classList.contains("active")) {
        navVisited.classList.remove("active");
    }
    hotelsDiv.style.display = "block";
    flightsDiv.style.display = "none";
    visitedDiv.style.display = "none";
}

const chooseVisited = () => {
    if (navHotel.classList.contains("active")) {
        navHotel.classList.remove("active");
    }
    if (navFlight.classList.contains("active")) {
        navFlight.classList.remove("active");
    }
    if (!navVisited.classList.contains("active")) {
        navVisited.classList.add("active");
    }
    hotelsDiv.style.display = "none";
    flightsDiv.style.display = "none";
    visitedDiv.style.display = "block";
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

               flightBookingFactory = new FlightBookingFactory();
               //OOP Refragment
               newObject = {};
               Object.keys(availableBookings.flights).forEach(key => {
                   newObject[key] = flightBookingFactory.create(availableBookings.flights[key], key); 
               })

               availableBookings.flights = newObject;

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
                
                hotelBookingFactory = new HotelBookingFactory();
                availableBookings.hotels = [];
                result.forEach(booking => {
                    availableBookings.hotels.push(hotelBookingFactory.create(booking, booking.id));
                })

                getVisitedLocations();
                
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

    const getVisitedLocations = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../api/profile/visited.php?getVisitedLocations&id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                visitedLocations = result;

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
        if (bookingDetail.iterations.length === 2) {
            iterationDiv = `
                <div>
                    <div>
                        <img src="http://pics.avs.io/50/30/${bookingDetail.iterations[0].flightNumber.substring(0, 2)}.png">
                        ${bookingDetail.iterations[0].flightNumber}: ${bookingDetail.iterations[0].locations.from.code} - 
                        ${bookingDetail.iterations[0].locations.to.code} 
                        (${bookingDetail.iterations[0].time.departure} - ${bookingDetail.iterations[0].time.arrival}) 
                    </div>
                    <div>
                        <img src="http://pics.avs.io/50/30/${bookingDetail.iterations[1].flightNumber.substring(0, 2)}.png">
                        ${bookingDetail.iterations[1].flightNumber}: ${bookingDetail.iterations[1].locations.from.code} - 
                        ${bookingDetail.iterations[1].locations.to.code} 
                        (${bookingDetail.iterations[1].time.departure} - ${bookingDetail.iterations[1].time.arrival}) 
                    </div>
                </div>
            `
        } else {
            iterationDiv = `
            <div>
                <div>
                    <img src="http://pics.avs.io/50/30/${bookingDetail.iterations[0].flightNumber.substring(0, 2)}.png">
                    ${bookingDetail.iterations[0].flightNumber}: ${bookingDetail.iterations[0].locations.from.code} - 
                    ${bookingDetail.iterations[0].locations.to.code} 
                    (${bookingDetail.iterations[0].time.departure} - ${bookingDetail.iterations[0].time.arrival}) 
                </div>
            </div>
        `
        }
        html += `
            <tr>
                <td>
                    ${getDisplayDateFormat(false, bookingDetail.date)}
                </td>
                <td>
                    ${iterationDiv}
                </td>
                <td>
                    ${bookingDetail.class}
                </td>
                <td>
                    ${bookingDetail.numberOfPax}
                </td>
                <td>
                    ${bookingDetail.totalPrice}
                </td>
                <td>
                    ${getDisplayDateFormatAdd7Hours(bookingDetail.date_booked)}
                </td>
                <td>
                    <a type="button" class="btn btn-view-booking btn-view-booking-flight" data-booking-id=${bookingDetail.booking_id}>View</a>
                </td>
            </tr>
        `
    })
    flightsDiv.querySelector("tbody").innerHTML = html;

    html = '';
    availableBookings.hotels.forEach(booking => {
        html += `
            <tr>
                <td>
                    ${getShortDisplayDateFormat(booking.dates.from)} - ${getShortDisplayDateFormat(booking.dates.to)}
                    <br>
                    (${booking.buildDurationString()})
                </td>
                <td>
                    ${booking.quantityInfo.rooms}
                </td>
                <td>
                    <div>
                        <img style="max-height: 100px; max-width: 100px; object-fit: contain;" alt="" 
                        src="${booking.hotel.url}">
                        <br>
                        ${booking.hotel.name}
                    </div>
                </td>
                <td>
                    ${booking.totalCost}
                </td>
                <td>
                    ${getDisplayDateFormatAdd7Hours(booking.date_booked)}
                </td>
                <td>
                    <a type="button" class="btn btn-view-booking btn-view-booking-hotel" data-booking-id=${booking.booking_id}>View</a>
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

    loadVisitedLocationsToMap();

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

const loadVisitedLocationsToMap = () => {
    //Filter object to show on map
    let sumLongitude = 0;
    let sumLatitude = 0;
    let attractions = [];
    visitedLocations.forEach(location => {
        attractions.push({
            position: {
                lng: location.longitude,
                lat: location.latitude
            },
            name: location.location_title
        })
        sumLongitude += location.longitude;
        sumLatitude += location.latitude;
    })

    //Center to be the center of all visited locations
    let center = {
        lng: visitedLocations.length > 0? parseFloat(sumLongitude / visitedLocations.length) : 0,
        lat: visitedLocations.length > 0? parseFloat(sumLatitude / visitedLocations.length) : 0
    }

    loadMap(center, attractions);
}

function loadMap(center, attractions = []) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 2,
      center: center,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });
    const centerMarker = new google.maps.Marker({
      position: center,
      map: map,
      icon: "../shared/assets/logo.svg",
    });
    attractions.forEach((attraction) => {
      let marker = new google.maps.Marker({
        position: attraction.position,
        title: attraction.name,
        map: map,
      });
    });
  }