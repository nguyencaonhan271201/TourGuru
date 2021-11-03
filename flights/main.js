let flightTypeInput = document.getElementById('flight-type');
let returnTimeInput = document.getElementById('arrival');
let fromSearch = document.getElementById("from");
let toSearch = document.getElementById("to");
let swapButton = document.getElementById("btn-exchange");
let fromID = "";
let toID = "";
let searchButton = document.getElementById("btn-search");
let errorText = document.querySelector("#error-modal #modal-error-content");
let isOneWay = true;
let departSearchResult = [];
let returnSearchResult = [];
let isPrintedFlight = false;
let totalFare = 0;
let departFare = 0;
let returnFare = 0;
let enterButton = document.getElementById("btn-confirm");
let fromFlightObject = null;
let toFlightObject = null;
let ratesList = null;
let choosingCurrency = "USD";

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.search.includes("session_ended")) {
        //errorText.innerHTML = "Your session is expired. Please try again";
        //$('#error-modal').modal("show");
        Swal.fire({
            icon: 'error',
            text: "Your session is expired. Please try again."
        });
    }

    initializeEventListener();
    getCurrencyInfo();
    document.querySelector(".search-result-div").style.display = "none";

    localStorage.setItem("fromFlight", null)
    localStorage.setItem("toFlight", null)
    localStorage.setItem("flightPassengers", null)

    let today = new Date().addHours(7).toISOString().split('T')[0];
    document.getElementById("depart").setAttribute('min', today);
    document.getElementById("arrival").setAttribute('min', today);

    enterButton.style.display = "none";

    enterButton.addEventListener("click", () => {
        fromFlightObject["class"] = document.getElementById("class").value;
        fromFlightObject["currencyCode"] = choosingCurrency;
        fromFlightObject["currencyRate"] = ratesList[choosingCurrency];
        localStorage.setItem("fromFlight", JSON.stringify(fromFlightObject));
        localStorage.setItem("toFlight", toFlightObject? JSON.stringify(toFlightObject) : null);
        //Check if signed in      
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                location.replace("./confirmation/");
            } else {
                location.replace("./../auth/login.php?flight_confirmation");
                return;
            }
        })
    });

    let checkInPicker = document.getElementById('depart');
    let checkOutPicker = document.getElementById('arrival');
    let picker = new Litepicker({
        element: checkInPicker,
        format: 'YYYY-MM-DD'
    });
    let picker2 = new Litepicker({
        element: checkOutPicker,
        format: 'YYYY-MM-DD'
    });
})

const getCurrencyInfo = () => {
    let xhr = new XMLHttpRequest();
    xhr.open(
        'GET',
        'https://exchangerate-api.p.rapidapi.com/rapid/latest/USD',
        true
    );
    xhr.onload = function() {
        if (this.status == 200) {
            let result = JSON.parse(this.responseText);
            ratesList = result.rates;

            //Upload the select
            Object.keys(ratesList).forEach((key) => {
                if (key != "USD") {
                    document.getElementById("currency").innerHTML += `<option value="${key}">${key}</option>`
                }
            })
        }
    }

    xhr.setRequestHeader("x-rapidapi-host", "exchangerate-api.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const initializeEventListener = () => {
    fromFlightObject = null;
    toFlightObject = null;

    flightTypeInput.addEventListener("change", () => {
        if (flightTypeInput.value == "oneway") {
            returnTimeInput.parentElement.parentElement.style.display = "none";
            document.getElementById("airport-search-div").setAttribute("class", "col-md-6 col-sm-12 d-flex p-0 mb-sm-2");
            document.getElementById("date-search-div").setAttribute("class", "col-md-4 col-sm-12 d-flex p-0 mb-sm-2");
            document.getElementById('depart').parentElement.parentElement.classList.add("right-most");
        } else {
            document.getElementById("airport-search-div").setAttribute("class", "col-md-5 col-sm-12 d-flex p-0 mb-sm-2");
            document.getElementById("date-search-div").setAttribute("class", "col-md-5 col-sm-12 d-flex p-0 mb-sm-2");
            returnTimeInput.parentElement.parentElement.style.display = "block";
            if (document.getElementById('depart').parentElement.parentElement.classList.contains("right-most")) {
                document.getElementById('depart').parentElement.parentElement.classList.remove("right-most");
            }
        }
    })

    fromSearch.addEventListener("focusin", (e) => {
        document.getElementById("search-flight-from-result").style.display = "flex";
    })

    fromSearch.addEventListener("focusout", (e) => {
        let isHovered = $('#search-flight-from-result').is(":hover");
        if (!isHovered) {
            resetSearchResult(true);
        }
    })

    toSearch.addEventListener("focusin", (e) => {
        document.getElementById("search-flight-to-result").style.display = "flex";
    })

    toSearch.addEventListener("focusout", (e) => {
        let isHovered = $('#search-flight-to-result').is(":hover");
        if (!isHovered) {
            resetSearchResult(false);
        }
    })

    fromSearch.addEventListener("keyup", (e) => {
        if (e.target.value !== "") {
            checkSearchCondition(e.target, true);   
        } else {
            document.getElementById("search-flight-from-result").innerHTML = "";
        }
    })

    toSearch.addEventListener("keyup", (e) => {
        if (e.target.value !== "") {
            checkSearchCondition(e.target, false);
        } else {
            document.getElementById("search-flight-to-result").innerHTML = "";
        }
    })

    swapButton.parentNode.addEventListener("click", (e) => {
        e.preventDefault();
        swapButton.classList.add("rotate");
        toSearch.value = fromID;
        fromSearch.value = toID;
        let tmp = fromID;
        fromID = toID;
        toID = tmp;
        setTimeout(() => {
            swapButton.classList.remove("rotate");
        }, 1000)
    })

    swapButton.addEventListener("click", (e) => {
        e.preventDefault();
        swapButton.classList.add("rotate");
        toSearch.value = fromID;
        fromSearch.value = toID;
        let tmp = fromID;
        fromID = toID;
        toID = tmp;
        setTimeout(() => {
            swapButton.classList.remove("rotate");
        }, 1000)
    })

    searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        //$("#loading-modal").modal("show");
        Swal.fire({
            title: 'Loading...',
            html: 'Please wait...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
          });

        //Validate information
        if (fromID == "") {
            swal.close();
            //$("#loading-modal").modal("hide");
            //errorText.innerHTML += "Origin airport is invalid. Please search again";
            //$("#error-modal").modal("show");
            Swal.fire({
                icon: 'error',
                text: "Origin airport is invalid. Please search again."
            });
            return;
        }

        if (toID == "") {
            swal.close();
            //$("#loading-modal").modal("hide");
            //errorText.innerHTML += "Destination airport is invalid. Please search again";
            //$("#error-modal").modal("show");
            Swal.fire({
                icon: 'error',
                text: "Destination airport is invalid. Please search again."
            });
            return;
        }

        //Get mode
        let getClass = document.getElementById("class").value;
        getClass = getClass == "Y"? "ECO" : getClass == "W"? "PEC" : getClass == "J"? "BUS" : "FST";

        isOneWay = document.getElementById("flight-type").value == "oneway";

        //Validate day
        let fromDate = new Date($('#depart').val());
        if (isNaN(fromDate.getTime())) {
            swal.close();
            //$("#loading-modal").modal("hide");
            //errorText.innerHTML += "Depart date is not valid. Please try again";
            //$("#error-modal").modal("show");
            Swal.fire({
                icon: 'error',
                text: "Depart date is not valid. Please try again."
            });
            return;
        }

        //Currency
        choosingCurrency = document.getElementById("currency").value;
        
        departFare = 0;
        returnFare = 0;
        totalFare = 0;
        document.getElementById("total-price").innerText = `0 ${choosingCurrency}`;
        departSearchResult = [];
        returnSearchResult = [];

        if (isOneWay) {
            getFlights("PRICE", fromDate.toISOString().split('T')[0], "ONE_WAY", getClass, 1, fromID, toID, true);
        }

        if (!isOneWay) {
            //Check for return day
            let toDate = new Date($('#arrival').val());
            if (isNaN(toDate.getTime())) {
                swal.close();
                //$("#loading-modal").modal("hide");
                //errorText.innerHTML += "Return date is not valid. Please try again";
                //$("#error-modal").modal("show");
                Swal.fire({
                    icon: 'error',
                    text: "Return date is not valid. Please try again."
                });
                return;
            }

            if (toDate.getTime() < fromDate.getTime()) {
                Swal.close();
                //$("#loading-modal").modal("hide");
                //errorText.innerHTML += "Return date cannot be before Depart date. Please try again";
                //$("#error-modal").modal("show");
                Swal.fire({
                    icon: 'error',
                    text: "Return date cannot be before Depart date. Please try again.",
                });
                return;
            }

            getFlights("DEPARTTIME", fromDate.toISOString().split('T')[0], "ONE_WAY", getClass, 1, fromID, toID, true);
            getFlights("DEPARTTIME", toDate.toISOString().split('T')[0], "ONE_WAY", getClass, 1, toID, fromID, false);
        }
    })
}

const checkSearchCondition = (box, isFrom) => {
    let tmpStoringResult = box.value;
    setTimeout(() => {
        if (box.value == tmpStoringResult) {
            getSearchInfo(box.value, isFrom);
        }
    }, 300)
}

const resetSearchResult = (isFrom) => {
    if (isFrom) {
        document.getElementById("search-flight-from-result").style.display = "none";
        document.getElementById("search-flight-from-result").innerHTML = "";
    } else {
        document.getElementById("search-flight-to-result").style.display = "none";
        document.getElementById("search-flight-to-result").innerHTML = "";
    }
}

const getSearchInfo = (searchQuery, isFrom) => {
    isPrintedFlight = false;
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);
            printToSearchBox(results, isFrom);
        } else {
            
        }
    }

    xhr.open("GET", `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations?name=${searchQuery}`);
    xhr.setRequestHeader("x-rapidapi-host", "priceline-com-provider.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const printToSearchBox = (results, isFrom) => {
    let getSearchBox = isFrom? document.getElementById("search-flight-from-result") : document.getElementById("search-flight-to-result");
    getSearchBox.innerHTML = "";
    results.forEach(result => {
        getSearchBox.innerHTML += `
            <div class="search-result" data-id=${result.id} data-is-from=${isFrom? "true":"false"}>
                <b>(${result.id})</b> ${result.displayName}
            </div>
        `
    })

    //Add event listener for each search-result
    document.querySelectorAll(".search-result")
    .forEach(result => {
        result.addEventListener("click", () => {
            let resultID = result.getAttribute("data-id");
            let isFrom = result.getAttribute("data-is-from") == "true";
            if (isFrom) {
                fromID = resultID;
                fromSearch.value = resultID;
                resetSearchResult(true);
            } else {
                toID = resultID;
                toSearch.value = resultID;
                resetSearchResult(false);
            }
        })
    })
}

const getFlights = (sort_order, date_departure, itinerary_type, class_type, number_of_pax, from, to, isDepart) => {

    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        swal.close();
        if(this.status == 200) {
            let results = JSON.parse(this.responseText);

            if (!isPrintedFlight) {
                isPrintedFlight = true;
                let searchBox = document.querySelector(".search-div");
                searchBox.classList.add("search-div-found");
            }

            let isOneWay = document.getElementById("flight-type").value == "oneway";
            if (isOneWay) {
                document.getElementById("return-div").style.display = "none";
                document.getElementById("return-sum").style.display = "none";
            } else {
                document.getElementById("return-div").style.display = "block";
                document.getElementById("return-sum").style.display = "block";
            }
            document.getElementById("return-chosen").style.display = "none";
            document.getElementById("depart-chosen").style.display = "none";

            printFlights(from, to, date_departure, results.airline, results.airport, results.equipment, results.pricedItinerary, 
                         results.slice, results.segment, isDepart);
        } else {
            Swal.fire({
                icon: 'error',
                text: "Error occured. Please try again later"
            });
        }

        //$("#loading-modal").modal("hide");
    }

    let url = `https://priceline-com-provider.p.rapidapi.com/v1/flights/search?sort_order=${sort_order}&` + 
    `date_departure=${date_departure}&location_arrival=${to}&itinerary_type=${itinerary_type}&` + 
    `location_departure=${from}&class_type=${class_type}&number_of_passengers=${number_of_pax}`;


    xhr.open("GET", url);
    xhr.setRequestHeader("x-rapidapi-host", "priceline-com-provider.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

const printFlights = (from, to, date, airlines, airport, equipment, pricedItinerary, slice, segment, isDepart) => {
    if (isDepart) {
        document.getElementById("depart-date-h2").innerText = getDisplayDateFormat(false, date);
        departSearchResult = [];
    } else {
        document.getElementById("return-date-h2").innerText = getDisplayDateFormat(false, date);
        returnSearchResult = [];
    }

    if (isDepart) {
        document.getElementById("depart-summary-from").innerText = `${from}`;
        document.getElementById("depart-summary-to").innerText = `${to}`;
    } else {
        document.getElementById("return-summary-from").innerText = `${from}`;
        document.getElementById("return-summary-to").innerText = `${to}`;
    }

    let container = isDepart? document.getElementById("depart-choices") : document.getElementById("return-choices");
    container.innerHTML = "";
    document.querySelector(".search-result-div").style.display = "block";
    if (slice == null || segment == null || pricedItinerary == null) {
        container.innerHTML = "<h3>no results found</h3>";

        if (isDepart) {
            document.getElementById("depart-summary-from").innerText = `${from}`;
            document.getElementById("depart-summary-to").innerText = `${to}`;
        } else {
            document.getElementById("return-summary-from").innerText = `${from}`;
            document.getElementById("return-summary-to").innerText = `${to}`;
        }
    }

    //Lọc các chuyến bay thẳng hợp lệ
    segmentsClone = segment.filter(segment => (segment.origAirport == from && segment.destAirport == to))
    segmentsID = []
    segmentsClone.forEach(segment => segmentsID.push(segment.uniqueSegId));
    console.log(segment);

    slicesClone = []
    slice.forEach(item => {
        let passed = true;
        item.segment.forEach(segment => {
            if (!segmentsID.includes(segment.uniqueSegId)) {
                passed = false;
            }
        })
        if (passed)
            slicesClone.push(item);
    })
    slicesID = []
    slicesClone.forEach(item => slicesID.push(item.uniqueSliceId));
    console.log(slice);

    itineraryClone = []
    pricedItinerary.forEach(itinerary => {
        let passed = true;
        itinerary.slice.forEach(item => {
            if (!slicesID.includes(item.uniqueSliceId)) {
                passed = false;
            }
        })
        if (passed)
            itineraryClone.push(itinerary);
    })

    //Dictionary for quick search
    let airlinesDict = Object.assign({}, ...airlines.map((x) => ({[x.code]: x.name})));
    let airportsDict = Object.assign({}, ...airport.map((x) => ({[x.code]: {
        "name": x.name,
        "city": x.city,
        "country": x.country
    }})));
    let equipmentsDict = Object.assign({}, ...equipment.map((x) => ({[x.code]: x.name})));
    let slicesDict = Object.assign({}, ...slicesClone.map((x) => ({[x.uniqueSliceId]: {
        "duration": x.duration,
        "segment": x.segment
    }})));
    let segmentsDict = Object.assign({}, ...segmentsClone.map((x) => ({[x.uniqueSegId]: {
        "duration": x.duration,
        "depart": x.departDateTime,
        "arrival": x.arrivalDateTime,
        "aircraft": equipmentsDict[x.equipmentCode],
        "flightnumber": x.flightNumber,
        "from": airportsDict[x.origAirport],
        "to": airportsDict[x.destAirport],
        "airline": {
            "code": x.marketingAirline,
            "name": airlinesDict[x.marketingAirline]
        }
    }})));

    if (isDepart) {
        document.getElementById("depart-date").innerText = getDisplayDateFormat(true, date);
    } else {
        document.getElementById("return-date").innerText = getDisplayDateFormat(true, date);
    }

    itineraryClone.forEach(itinerary => {
        if (itinerary.slice.length === 1) {
            let calculateFare = itinerary.pricingInfo.totalFare * ratesList[choosingCurrency];
            calculateFare = Math.round(calculateFare * 100) / 100
            fare = calculateFare.toString() + " " + choosingCurrency;
            let getSlice = slicesDict[itinerary.slice[0].uniqueSliceId]["segment"][0]["uniqueSegId"];
            let segment = segmentsDict[getSlice]
            
            // console.log(slicesDict);
            // console.log(itinerary.slice[0].uniqueSliceId);
            // console.log(getSlice);
            // console.log(segment);

            if (segment !== undefined) {
                segment.fare = itinerary.pricingInfo.totalFare;
                segment.fromICAO = from;
                segment.toICAO = to;
                let id = -1;
                let buttonClass = "";
                if (isDepart) {
                    departSearchResult.push(segment);
                    id = departSearchResult.length - 1;
                    buttonClass = "btn-depart";
                } else {
                    returnSearchResult.push(segment);
                    id = returnSearchResult.length - 1;
                    buttonClass = "btn-return";
                }


                if (id == 0) {
                    if (isDepart) {
                        document.getElementById("depart-summary-from").innerText = `${segment.from.city}`;
                        document.getElementById("depart-summary-to").innerText = `${segment.to.city}`;
                    } else {
                        document.getElementById("return-summary-from").innerText = `${segment.from.city}`;
                        document.getElementById("return-summary-to").innerText = `${segment.to.city}`;
                    }
                }

                let functionCallString = isDepart? `departSelect(event, ${id})` : `returnSelect(event, ${id})`;

                container.innerHTML += `
                    <div class="flight-option-box">
                        <div>
                            <img src="http://pics.avs.io/40/40/${segment.airline.code}.png" alt="">
                            <span>${segment.airline.name} - ${segment.airline.code}${segment.flightnumber}</span>
                        </div>
                        <p>${segment.aircraft}</p>
                        <div class="row">
                            <div class="col-md-9 col-sm-12">
                                <div class="d-flex justify-content-between">
                                    <div class="text-left mr-2">
                                        <p class="mt-1 mb-1">${segment.depart.substring(11, 16)}</p>
                                        <p class="text-gray mt-1 mb-0">${segment.from.name}</p>
                                        <p class="text-gray mb-1 mt-0">(${from})</p>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <span><i class="fas fa-plane"></i></span>    
                                    </div>
                                    <div class="text-left mr-2">
                                        <p class="mt-1 mb-1">${segment.arrival.substring(11, 16)}</p>
                                        <p class="text-gray mt-1 mb-0">${segment.to.name}</p>
                                        <p class="text-gray mb-1 mt-0">(${to})</p>
                                    </div>
                                    <div class="mr-2 d-flex flex-column align-items-center justify-content-start">
                                        <p id="return-duration" class="mt-1 mb-1">${timePrintFormat(segment.duration)}</p>
                                        <p class="mt-1 mb-1">Direct</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-12 d-flex align-items-end flex-column justify-content-sm-end justify-content-md-center">
                                <div class="text-right">
                                    <p class="total-price mb-0 mt-0">${fare}</p>
                                    <p class="mt-0 mb-0" id="container-total-price">/pax</p>
                                </div>
                                <button class="btn-full button-choose mt-2 ${buttonClass}" onclick="javascript:${functionCallString}">
                                    choose
                                </button>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    });
}

const departSelect = (e, id) => {
    document.querySelectorAll(".btn-depart").forEach(button => {
        button.setAttribute("class", "btn-full button-choose mt-2 btn-depart");
    })
    e.target.classList.add("chosen");

    let getFlight = departSearchResult[id];
    departFare = getFlight.fare * ratesList[choosingCurrency];
    totalFare = departFare + returnFare;
    document.getElementById("total-price").innerText = `${Math.round(totalFare * 100) / 100} ${choosingCurrency}`;
    let getClass = document.getElementById("class").value;
    //Update flight info
    document.getElementById("img-depart-airline").setAttribute("src", `http://pics.avs.io/40/40/${getFlight.airline.code}.png`);
    document.querySelector(".depart-airline-name").innerText = `${getFlight.airline.name} - ${getFlight.airline.code}${getFlight.flightnumber}`;
    document.querySelector("#depart-aircraft").innerText = `${getFlight.aircraft} - ${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}`;
    document.getElementById("depart-depart-time").innerText = `${getFlight.depart.substring(11, 16)}`;
    document.getElementById("depart-depart-airport-code").innerText = `${getFlight.fromICAO}`;
    document.getElementById("depart-arrive-time").innerText = `${getFlight.arrival.substring(11, 16)}`;
    document.getElementById("depart-arrive-airport-code").innerText = `${getFlight.toICAO}`;
    document.getElementById("depart-duration").innerText = `${timePrintFormat(getFlight.duration)}`;
    document.getElementById("depart-chosen").style.display = "initial";

    fromFlightObject = getFlight;
    if (!isOneWay && toFlightObject != null)
        enterButton.style.display = "block";
    if (isOneWay)
        enterButton.style.display = "block";
}

const returnSelect = (e, id) => {
    document.querySelectorAll(".btn-return").forEach(button => {
        button.setAttribute("class", "btn-full button-choose mt-2 btn-return");  
    })
    e.target.classList.add("chosen");
    let getClass = document.getElementById("class").value;
    let getFlight = returnSearchResult[id];
    returnFare = getFlight.fare * ratesList[choosingCurrency];
    totalFare = departFare + returnFare;
    document.getElementById("total-price").innerText = `${Math.round(totalFare * 100) / 100} ${choosingCurrency}`;

    //Update flight info
    document.getElementById("img-return-airline").setAttribute("src", `http://pics.avs.io/40/40/${getFlight.airline.code}.png`);
    document.querySelector(".return-airline-name").innerText = `${getFlight.airline.name} - ${getFlight.airline.code}${getFlight.flightnumber}`;
    document.querySelector("#return-aircraft").innerText = `${getFlight.aircraft} - ${getClass == "Y"? "ECONOMY" : getClass == "J"? "BUSINESS" : getClass == "F"? "FIRST" : "PREMIUM ECONOMY"}`;
    document.getElementById("return-depart-time").innerText = `${getFlight.depart.substring(11, 16)}`;
    document.getElementById("return-depart-airport-code").innerText = `${getFlight.fromICAO}`;
    document.getElementById("return-arrive-time").innerText = `${getFlight.arrival.substring(11, 16)}`;
    document.getElementById("return-arrive-airport-code").innerText = `${getFlight.toICAO}`;
    document.getElementById("return-duration").innerText = `${timePrintFormat(getFlight.duration)}`;
    document.getElementById("return-chosen").style.display = "initial";

    toFlightObject = getFlight;
    if (!isOneWay && fromFlightObject != null)
        enterButton.style.display = "block";
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
