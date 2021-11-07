let flightsDiv = document.getElementById("flights");
let fromSearch = document.getElementById("from-search");
let toSearch = document.getElementById("to-search");
let searchButton = document.getElementById("btn-search")

//getSearchInfo("Vietnam");
//getFlights("en-US", "SGN-sky", "HAN-sky", "VN", "anytime", "VND");

//Hàm tìm kiếm từ query
function getSearchInfo(searchQuery, isFrom) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            printToDropdown(results, isFrom);
        } else {
            console.log("Not found");
        }
    }

    xhr.open("GET", `https://priceline-com-provider.p.rapidapi.com/v1/flights/locations?name=${searchQuery}`);
    xhr.setRequestHeader("x-rapidapi-host", "priceline-com-provider.p.rapidapi.com");
     xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}



//Hàm lấy danh sách chuyến bay
function getFlights(sort_order, date_departure, itinerary_type, class_type, number_of_pax, from, to) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            console.log(results);
            printFlights(from, to, results.airline, results.airport, results.equipment, results.pricedItinerary, results.slice, results.segment);
        } else {
            console.log("Not found");
        }
    }

    let url = `https://priceline-com-provider.p.rapidapi.com/v1/flights/search?sort_order=${sort_order}&` + 
    `date_departure=${date_departure}&location_arrival=${to}&itinerary_type=${itinerary_type}&` + 
    `location_departure=${from}&class_type=${class_type}&number_of_passengers=${number_of_pax}`;

    xhr.open("GET", url);
    xhr.setRequestHeader("x-rapidapi-host", "priceline-com-provider.p.rapidapi.com");
     xhr.setRequestHeader("x-rapidapi-key", "742aa0556amsh7303bc849651e6dp100227jsn2956d8442b49");

    xhr.send();
}

//Hàm in kết quả
function printToDropdown(results, isFrom) {
    let getDropdown = isFrom? document.getElementById("from-airport") : document.getElementById("to-airport");
    getDropdown.innerHTML = "";
    results.forEach(result => {
        getDropdown.innerHTML += `
            <option value=${result.id}>(${result.id}) ${result.displayName}</option>
        `
    })
}

function printFlights(from, to, airlines, airport, equipment, pricedItinerary, slice, segment) {
    flightsDiv.innerHTML = "";
    if (slice == null || segment == null || pricedItinerary == null) {
        flightsDiv.innerHTML = "Can't found";
    }
    //Lọc các chuyến bay thẳng hợp lệ
    segmentsClone = segment.filter(segment => (segment.origAirport == from && segment.destAirport == to))
    segmentsID = []
    segmentsClone.forEach(segment => segmentsID.push(segment.uniqueSegId));
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

    itineraryClone.forEach(itinerary => {
        if (itinerary.slice.length === 1) {
            fare = itinerary.pricingInfo.totalFare.toString() + " " + itinerary.pricingInfo.currencyCode;
            let getSlice = slicesDict[itinerary.slice[0].uniqueSliceId]["segment"][0]["uniqueSegId"];
            let segment = segmentsDict[getSlice]
            
            console.log(slicesDict);
            console.log(itinerary.slice[0].uniqueSliceId);
            console.log(getSlice);
            console.log(segment);

            if (segment !== undefined) {
                flightsDiv.innerHTML += `
                <div class="col-md-4 col-sm-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${segment.airline.name} - ${segment.airline.code}${segment.flightnumber}</h5>
                            <p class="card-text">Duration: ${segment.duration} minutes</p>
                            <p class="card-text">Aircraft: ${segment.aircraft}</p>
                            <p class="card-text">Depart: ${segment.depart}</p>
                            <p class="card-text">Arrival: ${segment.arrival}</p>
                            <p class="card-text">Price: ${fare}</p>
                            <p class="card-text">${segment.from.name} - ${segment.to.name}</p>
                        </div>
                    </div>
                </div>
            `
            }
        }
    });
}


document.addEventListener("DOMContentLoaded", function() {
    fromSearch.addEventListener("keydown", (e) => {
        console.log(e.target.value);
        if (e.target.value !== "") {
            getSearchInfo(e.target.value, true);
        }
    })

    toSearch.addEventListener("keydown", (e) => {
        if (e.target.value !== "") {
            getSearchInfo(e.target.value, false);
        }
    })

    searchButton.addEventListener("click", (e) => {
        let fromDropdown = document.getElementById("from-airport") ;
        let toDropdown = document.getElementById("to-airport");
        let from = fromDropdown.value;
        let to = toDropdown.value;
        if (from === "" || to === "") {
            console.log("Please choose airport");
        } else {
            getFlights("DEPARTTIME", "2021-10-31", "ONE_WAY", "ECO", 1, from, to);   
        }
    })
})