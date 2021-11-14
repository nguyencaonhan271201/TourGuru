//DOM selectors
let errorText = document.querySelector("#error-modal #modal-error-content");
let btnBook = document.querySelector("#btn-book");
let paxSelect = document.getElementById("pax");
let changeFlight = document.getElementById("btn-confirm");
let paxInputSection = document.getElementById("pax-input-section");
let btnConfirm =  document.getElementById("btn-check");

//Global variable
let uid;
let user_email;
let departFlight = null;
let returnFlight = null;
let singleFare = 0;
let totalFare = 0;
let numberOfPax = 1;
let isBtnConfirm = true;
let usingCurrency = "USD";
let currencyRate = 1;
let paxInfos = [];

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//Ref: https://codepen.io/rxsharp/pen/jPZgpX
const countDown = (elementName, minutes, seconds) => {
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "remaining time: 0:00";
            endSession();
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = "remaining time: " + (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );

            if (msLeft < 61000 && !element.classList.contains("danger")) {
                element.classList.add("danger");
            }
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}

window.addEventListener("DOMContentLoaded", () => {
    //Check if signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            user_email = user.email;

            loadDataToDisplay();
 
            localStorage.setItem("flightPassengers", null);
            
            countDown("remaining-time", 10, 0);

            initializeEventListener();
        } else {
            location.replace("./../../auth");
            return;
        }
    })

    //Not chosen any flight
    if (!localStorage.getItem("fromFlight") || localStorage.getItem("fromFlight") == "null") {
        location.replace("./../");
        return;
    }
})

const endSession = () => {
    localStorage.setItem("fromFlight", null);
    localStorage.setItem("toFlight", null);
    location.replace("../index.php?session_ended");
}

const loadDataToDisplay = () => {
    let getFlight = JSON.parse(localStorage.getItem("fromFlight"));
    Object.setPrototypeOf(getFlight, Flight.prototype);
    departureFlight = getFlight;
    let getClass = getFlight.class;
    usingCurrency = getFlight.formattedFare.currency;
    currencyRate = getFlight["currencyRate"];

    singleFare = getFlight.formattedFare.value;
    totalFare = singleFare;

    //Update flight info
    document.getElementById("img-depart-airline").setAttribute("src", `http://pics.avs.io/40/40/${getFlight.airline.code}.png`);
    document.querySelector(".depart-airline-name").innerText = `${getFlight.airline.name} - ${getFlight.getFlightNumberDisplay()}`;
    document.getElementById("depart-depart-time").innerText = `${getFlight.getDepartTime()}`;
    document.getElementById("depart-depart-airport-code").innerText = `${getFlight.icaos.from}`;
    document.getElementById("depart-arrive-time").innerText = `${getFlight.getReturnTime()}`;
    document.getElementById("depart-arrive-airport-code").innerText = `${getFlight.icaos.to}`;
    document.getElementById("depart-duration").innerText = `${timePrintFormat(getFlight.duration)}`;
    document.getElementById("depart-chosen").style.display = "initial";
    document.querySelector("#depart-aircraft").innerText = `${getFlight.aircraft} - ${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}`;

    document.getElementById("depart-date").innerText = `${getDisplayDateFormat(true, getFlight.depart)}`;
    document.getElementById("depart-summary-from").innerText = `${getFlight.locations.from.city}`;
    document.getElementById("depart-summary-to").innerText = `${getFlight.locations.to.city}`;

    if (localStorage.getItem("toFlight") && localStorage.getItem("toFlight") != "null") {
        let getFlight = JSON.parse(localStorage.getItem("toFlight"));
        Object.setPrototypeOf(getFlight, Flight.prototype);
        returnFlight = getFlight;
        singleFare += getFlight.formattedFare.value;
        totalFare = singleFare;
    
        //Update flight info
        document.getElementById("img-return-airline").setAttribute("src", `http://pics.avs.io/40/40/${getFlight.airline.code}.png`);
        document.querySelector(".return-airline-name").innerText = `${getFlight.airline.name} - ${getFlight.getFlightNumberDisplay()}`;
        document.getElementById("return-depart-time").innerText = `${getFlight.getDepartTime()}`;
        document.getElementById("return-depart-airport-code").innerText = `${getFlight.icaos.from}`;
        document.getElementById("return-arrive-time").innerText = `${getFlight.getReturnTime()}`;
        document.getElementById("return-arrive-airport-code").innerText = `${getFlight.icaos.to}`;
        document.getElementById("return-duration").innerText = `${timePrintFormat(getFlight.duration)}`;
        document.getElementById("return-chosen").style.display = "initial";
        document.querySelector("#return-aircraft").innerText = `${getFlight.aircraft} - ${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}`;


        document.getElementById("return-date").innerText = `${getDisplayDateFormat(true, getFlight.depart)}`;
        document.getElementById("return-summary-from").innerText = `${getFlight.locations.from.city}`;
        document.getElementById("return-summary-to").innerText = `${getFlight.locations.to.city}`;
    } else {
        document.getElementById("return-sum").style.display = "none";
    }

    document.getElementById("total-price").innerText = `${Math.round(totalFare * 100) / 100} ${usingCurrency}`;
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

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

const initializeEventListener = () => {
    paxSelect.addEventListener("change", () => {
        numberOfPax = parseInt(paxSelect.value);
        totalFare = singleFare * numberOfPax;
        document.getElementById("total-price").innerText = `${Math.round(totalFare * 100) / 100} ${usingCurrency}`;
        document.getElementById("number-of-pax").innerText = `${numberOfPax} `;

        paxInputSection.innerHTML = "";
        for (let i = 0; i < numberOfPax; i++) {
            paxInputSection.innerHTML += `
                <div class="pax-input mt-3 mb-3" data-pax-id="${i + 1}">
                    <h4 class="text-pink mb-4">passenger ${i + 1}</h4>
                    <label for="title">title</label>
                    <select name="title" class="title-select">
                        <option value="Mr" selected="selected">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Mdm">Mdm</option>
                        <option value="Ms">Ms</option>
                        <option value="Mstr">Mstr</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
                        <option value="PhD">PhD</option>
                    </select>
                    <label for="dob">date of birth</label>
                    <input type="date" name="dob" class="dob" required>
                    <div class="input-div">
                        <label for="first">middle and first/given name (as in Passport)</label>
                        <input type="text" name="first" class="first" required>
                    </div>
                    <div class="input-div">
                        <label for="first">last/given name (as in Passport)</label>
                        <input type="text" name="last" class="last" required>
                    </div>
                    <div class="input-div">
                        <label for="first">passport</label>
                        <input type="text" name="passport" class="passport" required>
                    </div>
                </div>
            `
        }
    })

    changeFlight.addEventListener("click", () => {
        localStorage.setItem("fromFlight", null);
        localStorage.setItem("toFlight", null);
        location.replace("./../");
    })

    btnConfirm.addEventListener("click", () => {
        if (isBtnConfirm)
        {
            let isError = false;
            paxInfos = [];
            //Get list of inputs
            document.querySelectorAll(".pax-input").forEach((pax, index) => {
                if (!isError)
                {
                    errorText.innerHTML = "";
                    let title = pax.querySelector(".title-select").value;
                    let date = new Date(pax.querySelector(".dob").value);
                    if (isNaN(date.getTime())) {
                        //errorText.innerHTML += `Date of Birth of passenger ${index + 1} is invalid. Please try again`;
                        //$("#error-modal").modal("show");
                        Swal.fire({
                            icon: 'error',
                            text: `Date of Birth of passenger ${index + 1} is invalid. Please try again`
                        });
                        paxInfos = [];
                        isError = true;
                        return;
                    }
                    let first = pax.querySelector(".first").value;
                    if (first == "") {
                        //errorText.innerHTML += `First name of passenger ${index + 1} is invalid. Please try again`;
                        //$("#error-modal").modal("show");
                        Swal.fire({
                            icon: 'error',
                            text: `First name of passenger ${index + 1} is invalid. Please try again`
                        });
                        paxInfos = [];
                        isError = true;
                        return;
                    }
                    let last = pax.querySelector(".last").value;
                    if (last == "") {
                        //errorText.innerHTML += `Last name of passenger ${index + 1} is invalid. Please try again`;
                        //$("#error-modal").modal("show");
                        Swal.fire({
                            icon: 'error',
                            text: `Last name of passenger ${index + 1} is invalid. Please try again`
                        });
                        paxInfos = [];
                        isError = true;
                        return;
                    }
                    let passport = pax.querySelector(".passport").value;
                    if (passport.trim() == "") {
                        //errorText.innerHTML += `Passport of passenger ${index + 1} is invalid. Please try again`;
                        //$("#error-modal").modal("show");
                        Swal.fire({
                            icon: 'error',
                            text: "Passport of passenger ${index + 1} is invalid. Please try again."
                        });
                        paxInfos = [];
                        isError = true;
                        return;
                    }

                    document.querySelector(".warning").style.display = "block";

                    let passenger = new Passenger(
                        title,
                        date.toISOString().slice(0,10),
                        first.toUpperCase(),
                        last.toUpperCase(),
                        passport.toUpperCase()
                    )
    
                    paxInfos.push(passenger);
                }
                else
                    return;
            })

            if (paxInfos.length == 0) {
                return;
            }

            paxInputSection.innerHTML = "";
            //Everything is find
            paxInfos.forEach((pax, i) => {
                paxInputSection.innerHTML += `
                    <div class="pax-input mt-3 mb-3" data-pax-id="${i + 1}">
                        <h4 class="text-pink mb-4">passenger ${i + 1}</h4>
                        <h4 class="text-purple">${pax.getDisplayFull()}</h4>
                        <h5 class="text-purple">${getDisplayDateFormat(false, pax.dob)}</h5>
                        <h5 class="text-purple">passport: ${pax.passport}</h5>
                    </div>
                `;
            })

            isBtnConfirm = false;
            btnConfirm.innerText = "edit";
            btnBook.style.display = "initial";
        }
        else 
        {
            paxInputSection.innerHTML = "";
            paxInfos.forEach((pax, i) => {

                paxInputSection.innerHTML += `
                    <div class="pax-input mt-3 mb-3" data-pax-id="${i + 1}">
                        <h4 class="text-pink mb-4">passenger ${i + 1}</h4>
                        <label for="title">title</label>
                        <select name="title" class="title-select">
                            <option value="Mr" ${pax.title == "Mr" ? "selected= \"selected\"" : ""}>Mr</option>
                            <option value="Mrs" ${pax.title == "Mrs" ? "selected= \"selected\"" : ""}>Mrs</option>
                            <option value="Miss" ${pax.title == "Miss" ? "selected= \"selected\"" : ""}>Miss</option>
                            <option value="Mdm" ${pax.title == "Mdm" ? "selected= \"selected\"" : ""}>Mdm</option>
                            <option value="Ms" ${pax.title == "Ms" ? "selected= \"selected\"" : ""}>Ms</option>
                            <option value="Mstr" ${pax.title == "Mstr" ? "selected= \"selected\"" : ""}>Mstr</option>
                            <option value="Dr" ${pax.title == "Dr" ? "selected= \"selected\"" : ""}>Dr</option>
                            <option value="Prof" ${pax.title == "Prof" ? "selected= \"selected\"" : ""}>Prof</option>
                            <option value="PhD" ${pax.title == "PhD" ? "selected= \"selected\"" : ""}>PhD</option>
                        </select>
                        <label for="dob">date of birth</label>
                        <input type="date" name="dob" class="dob" value=${pax.dob} required>
                        <div class="input-div">
                            <label for="first">middle and first/given name (as in Passport)</label>
                            <input type="text" name="first" class="first" value="${pax.first}" required>
                        </div>
                        <div class="input-div">
                            <label for="first">last/given name (as in Passport)</label>
                            <input type="text" name="last" class="last" value="${pax.last}" required>
                        </div>
                        <div class="input-div">
                            <label for="first">passport</label>
                            <input type="text" name="passport" class="passport" value=${pax.passport} required>
                        </div>
                    </div>
                `;
            })

            isBtnConfirm = true;
            btnConfirm.innerText = "confirm";
            btnBook.style.display = "none";
        }
    })

    btnBook.addEventListener("click", performBook);
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

const performBook = () => {
    // localStorage.setItem("flightPassengers", JSON.stringify(paxInfos));
    // location.replace("./../booking-detail");
    Swal.fire({
        title: 'Are you sure want to book?',
        text: "You must complete your payment before the booking is valid.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#028a0f',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            title: 'The booking is being processed...',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });
    
        sendBookingInfo();
    }
    })
}

const sendBookingInfo = () => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf-flight-payment").innerText;

    let totalCostString = `${totalFare} ${usingCurrency}`

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/flights/flight.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let bookingID = parseInt(xhr.responseText);
            sendBookingIterations(bookingID);
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`bookingInfo&user_id=${uid}&total_cost=${totalCostString}&csrf=${csrf}`);
}

const sendBookingIterations = (bookingID) => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf-flight-payment").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/flights/flight.php",
        true
    )

    let sendData = [];
    let getFlight = JSON.parse(localStorage.getItem("fromFlight"));
    Object.setPrototypeOf(getFlight, Flight.prototype);
    let getClass = getFlight.class;
    sendData.push(getFlight.buildObjectForSend(getClass, bookingID));
    if (localStorage.getItem("toFlight") && localStorage.getItem("toFlight") != "null") {
        getFlight = JSON.parse(localStorage.getItem("toFlight"));
        Object.setPrototypeOf(getFlight, Flight.prototype);
        sendData.push(getFlight.buildObjectForSend(getClass, bookingID));
    }

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            sendPassengerInfos(bookingID);
        } else {
            swal.close();
            Swal.fire({
                icon: 'error',
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`bookingIterations&booking_id=${bookingID}&data=${JSON.stringify(sendData)}&csrf=${csrf}`);
}

const sendPassengerInfos = (bookingID) => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf-flight-payment").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/flights/flight.php",
        true
    )

    let sendData = [];
    paxInfos.forEach(pax => {
        sendData.push(pax.buildObjectForSend(bookingID))
    })

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            //Send email
            sendBookingConfirmationEmail();
        } else {
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`bookingCustomers&booking_id=${bookingID}&data=${JSON.stringify(sendData)}&csrf=${csrf}`);
}

const sendBookingConfirmationEmail = () => {
    let forwardHTML = "";
    let returnHTML = "";
    let dateString = "";
    
    let getClass = departureFlight.class;
    let getClassString = getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY";

    if (departureFlight != null) {
        forwardHTML += `<h4 class="text-purple">Forward Flight</h4>`;
        let forwardFlight = departureFlight;
        dateString += getDisplayDateFormat(false, forwardFlight.depart);
        paxInfos.forEach(pax => {
            forwardHTML += `
                <div class="boarding-pass" style="margin-bottom: 5px;">
                    <div class="flight-detail">
                        <div>
                            <img src="http://pics.avs.io/80/40/${forwardFlight.airline.code}.png" alt="">
                            <span>${forwardFlight.airline.name} - ${forwardFlight.getFlightNumberDisplay()}</span>
                        </div>
                        <p class="m-0">${forwardFlight.aircraft}</p>
                        <p class="m-0">${getDisplayDateFormat(true, forwardFlight.depart)}</p>
                        <div class="d-flex justify-content-between">
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${forwardFlight.getDepartTime()}</p>
                                <p class="text-gray mt-1 mb-0">${forwardFlight.locations.from.name}</p>
                                <p class="text-gray mb-1 mt-0">(${forwardFlight.icaos.from})</p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <span><i class="fas fa-plane"></i></span>    
                            </div>
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${forwardFlight.getReturnTime()}</p>
                                <p class="text-gray mt-1 mb-0">${forwardFlight.locations.to.name}</p>
                                <p class="text-gray mb-1 mt-0">(${forwardFlight.icaos.to})</p>
                            </div>
                            <div class="mr-2">
                                <p id="return-duration" class="mt-1 mb-1">${timePrintFormat(forwardFlight.duration)}</p>
                                <p class="mt-1 mb-1">Direct</p>
                            </div>
                        </div>
                    </div>
                    <div class="pax-detail">
                        <h3 class="pax-class">${getClassString}</h3>
                        <h3>${pax.getDisplayFull()}</h3>
                        <h3>DOB: ${getDisplayDateFormat(false, pax.dob)}</h3>
                        <h3>Passport: ${pax.passport}</h3>
                    </div>
                </div>
            `
        })
    }
    if (returnFlight != null) {
        returnHTML += `<h4 class="text-purple">Return Flight</h4>`;
        dateString += " and " + getDisplayDateFormat(false, returnFlight.depart);

        paxInfos.forEach(pax => {
            returnHTML += `
                <div class="boarding-pass" style="margin-bottom: 5px;">
                    <div class="flight-detail">
                        <div>
                            <img src="http://pics.avs.io/80/40/${returnFlight.airline.code}.png" alt="">
                            <span>${returnFlight.airline.name} - ${returnFlight.getFlightNumberDisplay()}</span>
                        </div>
                        <p class="m-0">${returnFlight.aircraft}</p>
                        <p class="m-0">${getDisplayDateFormat(true, returnFlight.depart)}</p>
                        <div class="d-flex justify-content-between">
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${returnFlight.getDepartTime()}</p>
                                <p class="text-gray mt-1 mb-0">${returnFlight.locations.from.name}</p>
                                <p class="text-gray mb-1 mt-0">(${returnFlight.icaos.from})</p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <span><i class="fas fa-plane"></i></span>    
                            </div>
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${returnFlight.getReturnTime()}</p>
                                <p class="text-gray mt-1 mb-0">${returnFlight.locations.to.name}</p>
                                <p class="text-gray mb-1 mt-0">(${returnFlight.icaos.to})</p>
                            </div>
                            <div class="mr-2">
                                <p id="return-duration" class="mt-1 mb-1">${timePrintFormat(returnFlight.duration)}</p>
                                <p class="mt-1 mb-1">Direct</p>
                            </div>
                        </div>
                    </div>
                    <div class="pax-detail">
                        <h3 class="pax-class">${getClassString}</h3>
                        <h3>${pax.getDisplayFull()}</h3>
                        <h3>DOB: ${getDisplayDateFormat(false, pax.dob)}</h3>
                        <h3>Passport: ${pax.passport}</h3>
                    </div>
                </div>
            `
        })    
    }

    let htmlContent = `
        <html>
            <head>
                ${css}
            </head>
            <body>
                <div class="booking-detail">
                    <div class="agency-detail">
                        <div class="agency-name">
                            <h2>Tour Guru</h2>
                        </div>
                    </div>
                    <div id="depart-div">
                        ${forwardHTML}
                    </div>
                    <div id="return-div">
                        ${returnHTML}
                    </div>
                </div>
                <hr>
                    <h4 class="text-pink" style="color: #c95998">total price</h4>
                    <h3 id="container-total-price"><h2 id="total-price" style="color: #a082af">${totalFare} ${usingCurrency}</h2></h3>

                    <hr>
                    <h4 class="text-pink" style="color: #c95998">payment info</h4>
                    <p class="payment-content">
                        <b id="hotel-name-span">Tour Guru</b> handles all the payment processes required.
                    </p>
                    <p class="payment-content">
                        payment methods accepted: American Express, Visa, Mastercard, Diners Club, JCB, Maestro, Discover, Bankcard, UnionPay Debit, UnionPay Credit
                    </p>
                    <hr>
                    <h4 class="text-pink" style="color: #c95998">policies</h4>
                    <p class="payment-content text-red" style="color: red;">
                        100% of the total fee must be completed in order for the booking to be valid. 
                    </p>
            </body>
        </html>
    `

    let flightOrFlights = returnFlight == null? "FLIGHT" : "FLIGHTS";
    let subject = `CONFIRMATION FOR YOUR ${flightOrFlights} ON ${dateString.toUpperCase()}`;

    let csrf = "";
    csrf = document.getElementById("csrf-flight-payment").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/flights/flight.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            let getFlight = JSON.parse(localStorage.getItem("fromFlight"));
            getFlight["totalPrice"] = `${totalFare} ${usingCurrency}`;
            localStorage.setItem("fromFlight", JSON.stringify(getFlight));
            localStorage.setItem("flightPassengers", JSON.stringify(paxInfos));
            location.replace("./../booking-detail");
        } else {
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }
    xhr.send(`sendEmail&to=${user_email}&subject=${subject}&content=${htmlContent}&csrf=${csrf}`);
}