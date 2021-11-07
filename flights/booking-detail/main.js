let forwardDiv = document.getElementById("depart-div");
let returnDiv = document.getElementById("return-div");
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

    //Booking complete
    Swal.fire({
        title: 'Booking is completed.',
        text: 'Please complete your payment and receive the confirmation through your email.',
        icon: 'success'
    })

    //Not chosen any flight
    if (localStorage.getItem("fromFlight") == "null" || localStorage.getItem("flightPassengers") == "null") {
        location.replace("./../");
        return;
    }

    printToDisplay();

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
})

const printToDisplay = () => {
    let paxList = JSON.parse(localStorage.getItem("flightPassengers"));
    //Forward flight
    let forwardFlight = JSON.parse(localStorage.getItem("fromFlight"));
    forwardDiv.innerHTML = `<h4 class="text-purple">Forward Flight</h4>`;

    let getClass = forwardFlight.class;

    paxList.forEach(pax => {
        forwardDiv.innerHTML += `
            <div class="boarding-pass mb-2">
                <div class="flight-detail">
                    <div>
                        <img src="http://pics.avs.io/80/40/${forwardFlight.airline.code}.png" alt="">
                        <span>${forwardFlight.airline.name} - ${forwardFlight.airline.code}${forwardFlight.flightnumber}</span>
                    </div>
                    <p class="m-0">${forwardFlight.aircraft}</p>
                    <p class="m-0">${getDisplayDateFormat(true, forwardFlight.depart)}</p>
                    <div class="d-flex justify-content-between">
                        <div class="text-left mr-2">
                            <p class="mt-1 mb-1">${forwardFlight.depart.substring(11, 16)}</p>
                            <p class="text-gray mt-1 mb-0">${forwardFlight.from.name}</p>
                            <p class="text-gray mb-1 mt-0">(${forwardFlight.fromICAO})</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-center">
                            <span><i class="fas fa-plane"></i></span>    
                        </div>
                        <div class="text-left mr-2">
                            <p class="mt-1 mb-1">${forwardFlight.arrival.substring(11, 16)}</p>
                            <p class="text-gray mt-1 mb-0">${forwardFlight.to.name}</p>
                            <p class="text-gray mb-1 mt-0">(${forwardFlight.toICAO})</p>
                        </div>
                        <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                            <p id="return-duration" class="mt-1 mb-1">${timePrintFormat(forwardFlight.duration)}</p>
                            <p class="mt-1 mb-1">Direct</p>
                        </div>
                    </div>
                </div>
                <div class="pax-detail">
                    <h3 class="pax-class">${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}</h3>
                    <h5>${pax.title} ${pax.first} ${pax.last}</h5>
                    <h5>DOB: ${getDisplayDateFormat(false, pax.dob)}</h5>
                    <h5>Passport: ${pax.passport}</h5>
                </div>
            </div>
        `
    })


    if (localStorage.getItem("toFlight") == "null") {
        returnDiv.innerHTML = ``;
    } else {
        let returnFlight = JSON.parse(localStorage.getItem("toFlight"));
        returnDiv.innerHTML = `<h4 class="text-purple">Return Flight</h4>`;
        paxList.forEach(pax => {
            returnDiv.innerHTML += `
                <div class="boarding-pass mb-2">
                    <div class="flight-detail">
                        <div>
                            <img src="http://pics.avs.io/80/40/${returnFlight.airline.code}.png" alt="">
                            <span>${returnFlight.airline.name} - ${returnFlight.airline.code}${returnFlight.flightnumber}</span>
                        </div>
                        <p class="m-0">${returnFlight.aircraft}</p>
                        <p class="m-0">${getDisplayDateFormat(true, returnFlight.depart)}</p>
                        <div class="d-flex justify-content-between">
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${returnFlight.depart.substring(11, 16)}</p>
                                <p class="text-gray mt-1 mb-0">${returnFlight.from.name}</p>
                                <p class="text-gray mb-1 mt-0">(${returnFlight.fromICAO})</p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <span><i class="fas fa-plane"></i></span>    
                            </div>
                            <div class="text-left mr-2">
                                <p class="mt-1 mb-1">${returnFlight.arrival.substring(11, 16)}</p>
                                <p class="text-gray mt-1 mb-0">${returnFlight.to.name}</p>
                                <p class="text-gray mb-1 mt-0">(${returnFlight.toICAO})</p>
                            </div>
                            <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                                <p id="return-duration" class="mt-1 mb-1">${timePrintFormat(returnFlight.duration)}</p>
                                <p class="mt-1 mb-1">Direct</p>
                            </div>
                        </div>
                    </div>
                    <div class="pax-detail">
                        <h3 class="pax-class">${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}</h3>
                        <h5>${pax.title} ${pax.first} ${pax.last}</h5>
                        <h5>DOB: ${getDisplayDateFormat(false, pax.dob)}</h5>
                        <h5>Passport: ${pax.passport}</h5>
                    </div>
                </div>
            `
        })    
    }
    
    document.getElementById("total-price").innerText = forwardFlight.totalPrice;
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