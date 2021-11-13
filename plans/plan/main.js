let title = "";
let uid;
let planID;
let created;
let fromDate = "";
let toDate = "";
let description = "";
let availableBookings = {
    flights: {},
    hotels: [],
};
let chosenBookings = {
    flights: [],
    hotels: []
};
let chosenBookingIndex = {
    flights: [],
    hotels: []
}
let details = [];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

window.addEventListener("DOMContentLoaded", () => {
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

            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("id")) {
                planID = urlParams.get("id");
            } else {
                location.replace("./../");
            } 

            gatherInformation();
        } else {
            location.replace("./../../auth/login.php");
            return;
        }
    })

    document.getElementById("btn-print").addEventListener("click", () => {
        document.querySelector(".btn-block").style.display = "none";
        document.querySelector(".agency-detail").style.display = "flex";

        var headstr = `<html><head><title>${title}</title></head><body>`;
        var footstr = "</body>";
        var newstr = document.querySelector(".main-container").innerHTML;
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = headstr+newstr+footstr;
        window.print();
        document.body.innerHTML = oldstr;

        document.querySelector(".btn-block").style.display = "block";
        document.querySelector(".agency-detail").style.display = "none";
        return false;

    });

    document.getElementById("btn-edit").addEventListener("click", (e) => {
        e.preventDefault();
        location.replace(`./../edit?id=${planID}`)
    });
})

const gatherInformation = () => {
    const gatherGeneralInfo = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanGeneral&user_id=${uid}&plan_id=${planID}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
               //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                title = result.plan_title;
                description = result.description;
                fromDate = result.from_date;
                toDate = result.to_date;
                created = result.date_created;
                chosenBookingIndex.flights = result.flight_id.split(',');
                chosenBookingIndex.hotels = result.hotel_id.split(',');
                chosenBookingIndex.flights = chosenBookingIndex.flights.map(flight => parseInt(flight));
                chosenBookingIndex.hotels = chosenBookingIndex.hotels.map(hotel => parseInt(hotel));
                getAvailableFlightBookings();
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

    const getAvailableFlightBookings = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/create.php?getFlightBookings&id=${uid}&csrf=${csrf}`,
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
                    location.replace("./../../");
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
            `../../api/plans/create.php?getHotelBookings&id=${uid}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                availableBookings.hotels = result;
                gatherPlanDetails();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                }).then(() => {
                    location.replace("./../../");
                })
            }
        }
        xhr.send();
    }

    const gatherPlanDetails = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanDetails&plan_id=${planID}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                result.forEach(result => {
                    let detailToAdd = {
                        date: result.date,
                        time: result.start,
                        detail: result.detail,
                        attraction: {
                            id: result.destination_id,
                            name: result.destination_name,
                            image: result.destination_image,
                        },
                        isRemind: result.set_alarmed,
                        rawID: result.id
                    }
                    details.push(detailToAdd);
                })
                //Load everything completed
                printToDisplay();
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

    gatherGeneralInfo();

    //dummyData();
}

const printToDisplay = () => {
    Swal.close();

    chosenBookingIndex.flights.forEach(index => {
        chosenBookings.flights.push(availableBookings.flights[index])
    });

    chosenBookingIndex.hotels.forEach(index => {
        availableBookings.hotels.forEach(hotelBooking => {
            if (hotelBooking.id == index) {
                chosenBookings.hotels.push(hotelBooking);
            }
        })
    });

    document.getElementById("plan-title").innerText = title;
    let dateString = "";
    if (fromDate == toDate) {
        dateString = getDisplayDateFormat(false, fromDate);
    } else {
        dateString = `${getDisplayDateFormat(false, fromDate)} - ${getDisplayDateFormat(false, toDate)}`
    }
    document.getElementById("plan-date").innerText = dateString;
    
    if (description == "") {
        document.getElementById("description-div").style.display = "none";
    } else {
        document.getElementById("plan-description").innerText = description;
        document.getElementById("description-div").style.display = "block";
    }

    document.getElementById("plan-created").innerText = `updated: ${getDisplayDateFormatAdd7Hours(created)}`;

    updateBookingLinkedDetail();

    printDetails();
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

const updateBookingLinkedDetail = () => {
    let html = ``;
    
    chosenBookings.flights.forEach(booking => {
        let subHTMLContent = ``;
        booking.forEach(iteration => {
            subHTMLContent += `
                <div>
                    <img src="http://pics.avs.io/80/40/${iteration.flight_number.substring(0, 2)}.png">
                    ${iteration.flight_number}: ${iteration.origin_code} - ${iteration.dest_code} (${iteration.departure} - ${iteration.arrival}) 
                    - ${getDisplayDateFormat(false, iteration.date)}
                </div>
            `
        })

        html += `
            <div class="flight-booking text-center mt-1 mb-1 editable-container" data-booking-id=${booking[0].booking_id}>
                ${subHTMLContent}
            </div>
        `
    })

    chosenBookings.hotels.forEach(hotel => {
        html += `
            <div class="hotel-booking text-center mt-2 mb-2 editable-container" data-booking-id=${hotel.id}>
                <i class="fa fa-hotel" aria-hidden="true"></i>
                ${hotel.hotel_name} - ${hotel.number_of_beds} rooms (${getDisplayDateFormat(false, hotel.date_start)} - ${getDisplayDateFormat(false, hotel.date_end)})
            </div>
        `
    })

    document.querySelector(".bookings").innerHTML = html;
}

const printDetails = () => {
    let detailsBox = document.getElementById("details");
    detailsBox.innerHTML = "";
    let html = "";

    const detailsByDay = {};
    details.forEach(detail => {
        let date = detail.date;
        if (Object.keys(detailsByDay).includes(date)) {
            detailsByDay[date].push(detail);
        } else {
            detailsByDay[date] = [];
            detailsByDay[date].push(detail);
        }
    }) 

    Object.keys(detailsByDay).forEach(key => {
        detailsByDay[key] = detailsByDay[key].sort(function(a, b) {
            return Date.parse('1970/01/01 ' + a.time.slice(0, -2) + ' ' + a.time.slice(-2)) - Date.parse('1970/01/01 ' + b.time.slice(0, -2) + ' ' + b.time.slice(-2))
        })
    })

    let listOfDays = Object.keys(detailsByDay).sort(
        function (a, b) {
            return Date.parse(a) - Date.parse(b)
        }
    )

    listOfDays.forEach(day => {
        html += `
            <h3 class="mt-2 text-purple">${getDisplayDateFormat(true, day)}</h3>
        `
        detailsByDay[day].forEach(detail => {
            let alarmClass = "";
            let attractionClass = "";
            if (detail.isRemind)
                alarmClass = '<span class="mr-1"><i class="fas fa-clock"></i></span>'
            if (detail.attraction.id != '')
                attractionClass = `
                    <p class="ml-2 mb-0">
                        <img style="width: 60px; height: 60px; object-fit: cover;" alt="" src="${detail.attraction.image}">
                        <span class="d-flex align-items-center" style="display: inline-flex !important">
                            <a target="_blank" href="/attraction/attraction.php?id=${detail.attraction.id}" class="destination">${detail.attraction.name}</a>
                        </span>
                    </p>
                `

            html += `
                <div class="editable-container left-container">
                    <p class="ml-2 mb-0 mt-1 text-gray">
                        <span class="text-pink time font-weight-bold" style="display: inline;">${detail.time}: </span>
                        <span>${detail.detail}</span>
                        ${alarmClass}
                    </p>
                    ${attractionClass}
                </div>
            `   
        }) 
    })

    detailsBox.innerHTML = html;
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
                'date_booked': '',
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
                    'flight_number': 'BA551'
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
                    'flight_number': 'AZ201'
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
                    'flight_number': 'BA551'
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
                    'flight_number': 'AZ201'
                }
            ]
        }
    }

    title = 'hanoi hanoi hanoi',
    description = 'hola welcome to the capital for the first time',
    fromDate = '2020-11-27',
    toDate = '2020-11-30',
    created = '2021-11-01'
    chosenBookingIndex = {
        flights: [1],
        hotels: [1]
    }

    details = [
        {
            "rawID": 1,
            "detail": "abcdef",
            "date": "2021-11-06",
            "time": "09:45",
            "isRemind": false,
            "attraction": {
                "id": "953101",
                "name": "Disney’s Hollywood Studios",
                "image": "https://media-cdn.tripadvisor.com/media/photo-m/1280/18/df/2c/bb/disney-s-hollywood-studios.jpg",
            }
        },
        {
            "rawID": 2,
            "detail": "wake me up",
            "date": "2021-11-06",
            "time": "06:00",
            "isRemind": true,
            "attraction": {
                "id": "",
                "name": "",
                "image": "",
            }
        }
    ]
}