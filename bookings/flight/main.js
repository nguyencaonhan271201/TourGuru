let forwardDiv = document.getElementById("depart-div");
let returnDiv = document.getElementById("return-div");
let flightBookingID;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let passengers = [];
let flightInfo = [];

window.addEventListener("DOMContentLoaded", () => {
    //Check if signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            user_email = user.email;
        } else {
            location.replace("./../../auth");
            return;
        }
    })

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
        flightBookingID = urlParams.get("id");
    } else {
        location.replace("./../");
    } 

    Swal.fire({
        title: 'Loading...',
        html: 'Please wait...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
    });

    getFlightBookingInfo();


    document.getElementById("print").addEventListener("click", () => {
        document.getElementById("print-block").style.display = "none";

        var headstr = "<html><head><title>Booking Details</title></head><body>";
        var footstr = "</body>";
        var newstr = document.getElementById("booking-detail").innerHTML;
        var oldstr = document.body.innerHTML;
        document.body.innerHTML = headstr+newstr+footstr;
        window.print();
        document.body.innerHTML = oldstr;

        document.getElementById("print-block").style.display = "initial";

        return false;

    });

    document.getElementById("delete").addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure want to delete this booking?',
            text: 'You cannot restore the booking after deletion. Refund will be made by the airlines.',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Loading...',
                    html: 'Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                deleteBooking();
            }
        })
    });
})

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
            "/api/bookings/info.php",
            true
        )
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
            swal.close();
            if (this.status === 200 && this.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(this.responseText); 
                flightInfo = result;
                getPassengersInfo();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                });
                location.replace("./../");
            }
        }
        xhr.send(`getFlightsInfo&booking_id=${flightBookingID}&user_id=${uid}&csrf=${csrf}`);
    }

    const getPassengersInfo = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            "/api/bookings/info.php",
            true
        )
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = () => {
            swal.close();
            if (this.status === 200 && this.readyState === 4) {
                //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(this.responseText); 
                passengers = result;
                printToDisplay();
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured."
                });
                location.replace("./../");
            }
        }
        xhr.send(`getFlightsPax&booking_id=${flightBookingID}&user_id=${uid}&csrf=${csrf}`);
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

    console.log(arrivalInfo,)

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
                        <img src="http://pics.avs.io/40/40/${forwardFlight.flight_number.substring(0, 2)}.png" alt="">
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
                            <img src="http://pics.avs.io/40/40/${returnFlight.flight_number.substring(0, 2)}.png" alt="">
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

    Swal.close();
}

const deleteBooking = () => {
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "/api/bookings/info.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
        if (this.status === 200 && this.readyState === 4) {
            Swal.fire({
                title: 'Your booking has been deleted successfully.',
                icon: 'success'
            })

            location.replace("./../")
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`deleteFlightBooking&booking_id=${planID}&user_id=${uid}&csrf=${csrf}`);
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