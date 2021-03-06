let forwardDiv = document.getElementById("depart-div");
let returnDiv = document.getElementById("return-div");
let flightBookingID;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let passengers = [];
let flightInfo = [];

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
    
    //Check if signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            uid = user.uid;
            user_email = user.email;

            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("id")) {
                flightBookingID = urlParams.get("id");
            } else {
                location.replace("./../");
            } 

            getFlightBookingInfo();
        } else {
            location.replace("./../../auth");
            return;
        }
    })

    document.getElementById("print").addEventListener("click", () => {
        performPrint();
    });
})

const performPrint = () => {
    document.getElementById("print-block").style.display = "none";

    var headstr = "<html><head><title>Booking Details</title></head><body>";
    var footstr = "</body>";
    var newstr = document.getElementById("booking-detail").innerHTML;
    var oldstr = document.body.innerHTML;
    document.body.innerHTML = headstr+newstr+footstr;
    window.print();
    document.body.innerHTML = oldstr;

    document.getElementById("print-block").style.display = "initial";

    document.getElementById("print").addEventListener("click", () => {
        performPrint();
    });

    return false;
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

const timePrintFormat = (minute) => {
    var num = minute;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    let returnString = rhours > 0? `${rhours}h ` : "";
    returnString += ` ${rminutes}m`;
    return returnString;
}

const getFlightBookingInfo = () => {
    const getInfoAndIterations = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/bookings/info.php?getFlightsInfoAdmin&booking_id=${flightBookingID}&user_id=gxRWAj31d4hQFJrHmwqwI4GlEOZ2&csrf=${csrf}&isAdmin=true`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nh???n th??ng tin v?? l??u v??o danh m???c
                let result = JSON.parse(xhr.responseText); 
                flightInfo = result;
                getPassengersInfo();
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

    const getPassengersInfo = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/bookings/info.php?getFlightsPaxAdmin&booking_id=${flightBookingID}&user_id=gxRWAj31d4hQFJrHmwqwI4GlEOZ2&csrf=${csrf}&isAdmin=true`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Nh???n th??ng tin v?? l??u v??o danh m???c
                let result = JSON.parse(xhr.responseText); 
                passengers = result;
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

    getInfoAndIterations();

    //dummyData();
    //printToDisplay();
}

const calculateDuration = (depart, arrival) => {
    let departInfo = depart.split(':');
    departInfo = departInfo.map(info => parseInt(info));
    let arrivalInfo = arrival.split(':');
    arrivalInfo = arrivalInfo.map(info => parseInt(info));

    if (arrivalInfo[0] < departInfo[0]) {
        arrivalInfo[0] += 24;
    }

    let minute = arrivalInfo[0] * 60 + arrivalInfo[1] - departInfo[0] * 60 - departInfo[1];
    return timePrintFormat(minute);
}

const printToDisplay = () => {
    //Forward flight
    let forwardFlight = flightInfo[0];
    forwardDiv.innerHTML = `<h4 class="text-purple">Forward Flight</h4>`;

    let getClass = forwardFlight.class;

    passengers.forEach(pax => {
        forwardDiv.innerHTML += `
            <div class="boarding-pass mb-2">
                <div class="flight-detail">
                    <div>
                        <img src="http://pics.avs.io/80/40/${forwardFlight.flight_number.substring(0, 2)}.png" alt="">
                        <span>${forwardFlight.airline} - ${forwardFlight.flight_number}</span>
                    </div>
                    <p class="m-0">${forwardFlight.aircraft}</p>
                    <p class="m-0">${getDisplayDateFormat(true, forwardFlight.date)}</p>
                    <div class="d-flex justify-content-between">
                        <div class="text-left mr-2">
                            <p class="mt-1 mb-1">${forwardFlight.departure}</p>
                            <p class="text-gray mt-1 mb-0">${forwardFlight.origin}</p>
                            <p class="text-gray mb-1 mt-0">(${forwardFlight.origin_code})</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                            <span><i class="fas fa-plane"></i></span>    
                        </div>
                        <div class="text-left mr-2">
                            <p class="mt-1 mb-1">${forwardFlight.arrival}</p>
                            <p class="text-gray mt-1 mb-0">${forwardFlight.destination}</p>
                            <p class="text-gray mb-1 mt-0">(${forwardFlight.dest_code})</p>
                        </div>
                        <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                            <p id="return-duration" class="mt-1 mb-1">${calculateDuration(forwardFlight.departure, forwardFlight.arrival)}</p>
                            <p class="mt-1 mb-1">Direct</p>
                        </div>
                    </div>
                </div>
                <div class="pax-detail">
                    <h3 class="pax-class">${getClass}</h3>
                    <h5>${pax.title} ${pax.display_name}</h5>
                    <h5>DOB: ${getDisplayDateFormat(false, pax.dob)}</h5>
                    <h5>Passport: ${pax.passport}</h5>
                </div>
            </div>
        `
    })


    if (flightInfo.length === 1) {
        returnDiv.innerHTML = ``;
    } else {
        let returnFlight = flightInfo[1];
        returnDiv.innerHTML = `<h4 class="text-purple">Return Flight</h4>`;
        passengers.forEach(pax => {
            returnDiv.innerHTML += `
                <div class="boarding-pass mb-2">
                    <div class="flight-detail">
                        <div>
                            <img src="http://pics.avs.io/80/40/${returnFlight.flight_number.substring(0, 2)}.png" alt="">
                            <span>${returnFlight.airline} - ${returnFlight.flight_number}</span>
                        </div>
                        <p class="m-0">${returnFlight.aircraft}</p>
                        <p class="m-0">${getDisplayDateFormat(true, returnFlight.date)}</p>
                        <div class="d-flex justify-content-between">
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${returnFlight.departure}</p>
                                <p class="text-gray mt-1 mb-0">${returnFlight.origin}</p>
                                <p class="text-gray mb-1 mt-0">(${returnFlight.origin_code})</p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <span><i class="fas fa-plane"></i></span>    
                            </div>
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${returnFlight.arrival}</p>
                                <p class="text-gray mt-1 mb-0">${returnFlight.destination}</p>
                                <p class="text-gray mb-1 mt-0">(${returnFlight.dest_code})</p>
                            </div>
                            <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                                <p id="return-duration" class="mt-1 mb-1">${calculateDuration(returnFlight.departure, returnFlight.arrival)}</p>
                                <p class="mt-1 mb-1">Direct</p>
                            </div>
                        </div>
                    </div>
                    <div class="pax-detail">
                        <h3 class="pax-class">${getClass}</h3>
                        <h5>${pax.title} ${pax.display_name}</h5>
                        <h5>DOB: ${getDisplayDateFormat(false, pax.dob)}</h5>
                        <h5>Passport: ${pax.passport}</h5>
                    </div>
                </div>
            `
        })    
    }
    
    document.getElementById("total-price").innerText = forwardFlight.total_price;

    let approveHTML = ``;
    if (forwardFlight.approved === 0) {
        approveHTML += `<span class="pending">PENDING</span>`;
    } else if (forwardFlight.approved === 1) {
        approveHTML += `<span class="approved">APPROVED</span>`;
    } else {
        approveHTML += `<span class="rejected">REJECTED</span>`;
    }

    document.getElementById("approve-status").innerHTML = approveHTML;

    Swal.close();
}

//For testing only
const dummyData = () => {
    flightInfo = [
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
    ]

    passengers = [
        {
            id: 1,
            booking_id: 1,
            title: 'Mr',
            display_name: 'CAO NHAN NGUYEN',
            dob: '2001-12-27',
            passport: 'ABCD12345'
        },
        {
            id: 2,
            booking_id: 1,
            title: 'Mr',
            display_name: 'SON TUNG NGUYEN',
            dob: '2004-05-26',
            passport: 'DCBA12345'
        }
    ]


}