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
let choosingAttraction = {
    id: '',
    name: '',
    image: '',
}
let choosingColab = {
    id: '',
    name: '',
    image: '',
}
let wrapperLocations = [];
let choosingWrapperLocation = {
    location_id: '',
    location_name: '',
    location_image: '',
}
let colabs = [];
let currentUser = {};

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getInfoFromServer = async() => {
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `../../api/profile/edit.php?getHeaderInfo&id=${uid}&csrf=${csrf}`,
        true
    )
    xhr.onload = () => {
        Swal.close();
        if (xhr.status === 200 && xhr.readyState === 4) {
           //Nhận thông tin và in ra các ô input
            let result = JSON.parse(xhr.responseText); 
            currentUser = result;
            let colabList = document.getElementById("colabs-display");
            colabList.innerHTML = `
                <div class="mdc-chip" role="row">
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${currentUser.image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${currentUser.display_name || currentUser.name || currentUser.mail}</span>
                        </span>
                    </span>
                </div>
            `;
        }
    }
    xhr.send();
}

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

            getInfoFromServer();        
            reInitializeEventListeners();

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

    reInitializeEventListeners();

    document.getElementById("btn-save").addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure want to save this plan?',
            text: 'Further modifications are allowed.',
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
                savePlan();
            }
        })
    })

    document.getElementById("btn-delete").addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure want to delete this plan?',
            text: 'You cannot recover the plan after deleted.',
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
                deletePlan(planID, true);
            }
        })
    })
})

const reInitializeEventListeners = () => {
    document.querySelectorAll(".editable-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            let getType = icon.getAttribute("data-type");
            switch (getType) {
                case "title":
                    showTitleSwal();
                    break;
                case "date":
                    showDateSwal();
                    break;
                case "description":
                    showDescriptionSwal();
                    break;
                case "mode":
                    showModeSwal();
                    break;
                case "colab":
                    showAddColabSwal();
                    break;
                case "wrapper-location":
                    showAddWrapperLocationsSwal();
                    break;
                case "day-info":
                    showDayInfoSwal(icon.getAttribute("data-day"));
                    break;
                case "day-delete":
                    showDayDeleteSwal(icon.getAttribute("data-day"));
                    break;
            }
        })
    })

    if (document.getElementById("add-description"))
        document.getElementById("add-description").addEventListener("click", () => {
            showDescriptionSwal();
        })

    document.getElementById("add-booking").addEventListener("click", () => {
        showAddBookingSwal();
    })

    var old_element = document.getElementById("add-day");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    
    document.getElementById("add-day").addEventListener("click", () => {
        performAddDay();
    })
    document.querySelectorAll(".add-detail").forEach(btn => {
        btn.addEventListener("click", () => {
            showAddDetailSwal(btn.getAttribute("data-day"));
    })});
}

const performAddDay = () => {
    let dayToAdd = details.length + 1;
    details.push([])
    let detailsDiv = document.getElementById("details");
    detailsDiv.innerHTML += `
        <div id="day-${dayToAdd}" class="day-draggable mt-3 mb-3 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12">
            <div class="editable-container text-left day-div">
                <h4 class="text-purple text-left">day ${dayToAdd}</h4>
                <p class="editable-icon" data-day=${dayToAdd} data-type="day-delete"><i class="fas fa-trash"></i></p>
            </div>
            

            <div class="details"></div>

            <div class="add-detail-day-div" data-day=${dayToAdd}
            data-tooltip="Add a detail to day ${dayToAdd}" data-tooltip-location="bottom"
            onClick="showAddDetailSwal(${dayToAdd});">
                <i class="fa fa-plus" aria-hidden="true"></i>
            </div>
            
        </div>
    `
    document.querySelectorAll(".add-detail").forEach(btn => {
        btn.addEventListener("click", () => {
            showAddDetailSwal(btn.getAttribute("data-day"));
    })});

    document.getElementById("details").querySelectorAll(".editable-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            let type = icon.getAttribute("data-type");
            if (type === "day-delete") {
                let day = icon.getAttribute("data-day");
                showDayDeleteSwal(day);
            } 
        })
    })
}

const showAddColabSwal = () => {
    Swal.fire({
        title: 'Add a collaborator',
        html: `
            <div class="text-left">
                <div id="current-collabs" class="mt-2 mb-2">
                    <span>colabs: </span>
                    <span id="colabs-list"></span>
                </div>
                <div id="chosen-colab" class="text-center mt-2 mb-2"></div>
                <div class="text-center">
                    <label for="colab" class="mr-2">search for a collaborator:</label><input class="swal2-input mt-1" type="text" id="colab"></input><br>
                    <div class="input-block input-block-abs mt-2">
                        <div id="search-colab-result" class="header-search-result"></div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            let colabSearch = document.getElementById("colab")
            colabSearch.addEventListener("keyup", (e) => {
                if (e.target.value !== "") {
                    document.getElementById("search-colab-result").innerHTML = "Searching...";
                    checkSearchColabCondition(e.target, true);   
                } else {
                    document.getElementById("search-colab-result").innerHTML = "";
                }
            })

            let colabList = document.getElementById("colabs-list");
            let listHTML = ``;
            colabs.forEach(colab => {
                listHTML += `<div class="mdc-chip" role="row" data-id = ${colab.id}>
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${colab.image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${colab.display_name  || colab.name || colab.mail}</span>
                        </span>
                    </span>
                    <span role="gridcell">
                        <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                        onclick = "deleteSelectedColab(event)">cancel</i>
                    </span>
                </div>`
            })
            colabList.innerHTML = listHTML;
        },
        preConfirm: () => {
            if (choosingColab.id !== "") {
                colabs.push(choosingColab);

                reDisplayColabs();
            }
            choosingColab = {
                id: '',
                name: '',
                image: '',
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const deleteSelectedColab = (e) => {
    let getParent = e.target.closest(".mdc-chip");
    let getID = getParent.getAttribute("data-id");

    choosingColab = {
        id: '',
        name: '',
        image: '',
    }

    let newColabs = [];
    colabs.forEach(colab => {
        if (colab.id != getID) {
            newColabs.push(colab);
        }
    })
    colabs = newColabs;
    let colabList = document.getElementById("colabs-list");
    let listHTML = ``;
    colabs.forEach(colab => {
        listHTML += `<div class="mdc-chip" role="row" data-id = ${colab.id}>
            <div class="mdc-chip__ripple"></div>
            <img class="mdc-chip__icon mdc-chip__icon--leading" src="${colab.image}"></img>
            <span role="gridcell">
                <span role="button" tabindex="0" class="mdc-chip__primary-action">
                    <span class="mdc-chip__text">${colab.name}</span>
                </span>
            </span>
            <span role="gridcell">
                <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                onclick = "deleteSelectedColab(event)">cancel</i>
            </span>
        </div>`
    })
    colabList.innerHTML = listHTML;

    reDisplayColabs();

    document.getElementById("chosen-colab").innerHTML = "";
}

function recreateNode(el, withChildren) {
    if (withChildren) {
      el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
}

const checkSearchColabCondition = (box, isFrom) => {
    let tmpStoringResult = box.value;
    setTimeout(() => {
        if (box.value == tmpStoringResult) {
            searchColab(box.value);
        }
    }, 300)
}

const searchColab = (searchQuery) => {
    const xhr = new XMLHttpRequest();
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;

    xhr.open(
        "POST",
        "../../api/plans/create.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            printColabSearchResults(results);
        } else {
            
        }
    }

    xhr.send(`searchColabs&query=${encodeURIComponent(searchQuery)}&csrf=${csrf}`);
}

const reDisplayColabs = () => {
    let colabList = document.getElementById("colabs-display");
    let listHTML = ``;

    colabs.forEach((colab, index) => {
        listHTML += `<img 
            src=${colab.image}
            alt=""
            style="z-index: ${colabs.length + 1 - index}"></img>`
    })

    listHTML += `<img 
            src="./../../shared/assets/images/person_add.png";
            alt=""
            style="z-index: ${0}"></img>`


    colabList.innerHTML = listHTML;
}

const printColabSearchResults = (results) => {
    let resultBox = document.getElementById("search-colab-result");
    let html = ``
    results.forEach(result => {
        let found = false;
        colabs.forEach(colab => {
            if (result.user_id === colab.id) {
                found = true;
            }
        });
        if (!found) {
            found = result.user_id === uid;
        }
        if (!found) {
            html += `
            <div class="colab-result" data-id="${result.user_id}" data-name="${result.display_name}"
                data-image="${result.image}">
                <div class="row">
                    <div class="col-md-4 col-sm-6 offset-md-0 offset-sm-3">
                        <img src="${result.image}" alt="" class="des-result-img">
                    </div>
                    <div class="col-md-8 col-sm-12 d-flex align-items-center justify-content-center justify-content-md-start">
                        <div class="text-md-left text-center">
                            <h5 class="text-pink">${result.display_name}</h5>
                            <p class="text-gray">${result.mail}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        }
    })
    resultBox.innerHTML = html;

    document.querySelectorAll(".colab-result").forEach(result => {
        result.addEventListener("click", () => {
            let id = result.getAttribute("data-id");
            let name = result.getAttribute("data-name");
            let image = result.getAttribute("data-image");
            choosingColab = {
                id: id,
                name: name,
                image: image,
            }
            document.getElementById("chosen-colab").innerHTML = `
                <div class="mdc-chip" role="row" data-id = ${id}>
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${name}</span>
                        </span>
                    </span>
                    <span role="gridcell">
                        <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                        onclick = "deleteSelectedColab(event)">cancel</i>
                    </span>
                </div>
            `
            resultBox.innerHTML = "";
            document.getElementById("colab").value = "";
        })
    })
}

const showModeSwal = () => {
    Swal.fire({
        title: 'Change plan mode',
        input: 'select',
        inputValue: planMode,
        inputAttributes: {
            autocapitalize: 'off'
        },
        inputOptions: {
            0: "private",
            1: "public"
        },
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        preConfirm: (newMode) => {
            planMode = newMode;
            let modeHTML = planMode === 0 ? `<i class="fas fa-lock"></i>` : `<i class="fas fa-globe-asia"></i>`;
            document.getElementById("plan-mode").innerHTML = modeHTML;
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showDateSwal = () => {
    Swal.fire({
        title: 'Change plan dates',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showCancelButton: true,
        html:
            `<label for="from" class="mr-2">from:</label><input class="swal2-input" type="text" id="from" placeholder="from" value=${fromDate}><br>` +
            `<label for="from" class="mr-2">to: </label><input class="swal2-input" type="text" id="to" placeholder="to" value=${toDate}>`,
        preConfirm: () => {
            //Get input
            let from = $('#from').val();
            let to = $('#to').val();
            
            let errorText = "";
            if (from === "")
                errorText += `input of start date is not correct.`
            else if (to === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `input of end date is not correct.`
            }
            else {
                let fromDate = new Date($('#from').val());
                let toDate = new Date($('#to').val());
                if (toDate.getTime() < fromDate.getTime()) {
                    if (errorText !== "")
                        errorText += '<br>'   
                    errorText += `start date cannot be after end date`
                }
            }
                
            if (errorText !== "")
                Swal.showValidationMessage(
                    errorText
                )  
            else {
                //Build display string
                let dateString = "";
                
                let from = new Date($('#from').val());
                let to = new Date($('#to').val());

                fromDate = from.toISOString().split('T')[0]
                toDate = to.toISOString().split('T')[0]
                
                if (from.getTime() == to.getTime()) {
                    dateString = getDisplayDateFormat(false, fromDate);
                } else {
                    dateString = `${getDisplayDateFormat(false, fromDate)} - ${getDisplayDateFormat(false, toDate)}`
                }

                document.getElementById("plan-date").innerText = dateString;
            }
        },
        didOpen: function () {
            let picker = new Litepicker({
                element: document.getElementById("from"),
                format: 'YYYY-MM-DD'
            });
            let picker2 = new Litepicker({
                element: document.getElementById("to"),
                format: 'YYYY-MM-DD'
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showTitleSwal = () => {
    Swal.fire({
        title: 'Change plan title',
        html: `
            <div class="d-flex flex-column align-items-center justify-content-center">
                <input 
                value="${title}"
                required id="title" autocapitalize="none" class="swal2-input" style="display: flex;" placeholder="" type="text"></input>

                <p class="mb-0 mt-1">plan mode</p>
                <select id="mode" autocapitalize="none" class="swal2-select" style="display: flex;">
                    <option id="private" value="0">private</option>
                    <option id="public" value="1">public</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            document.getElementById("title").value = title;

            if (planMode === "0" || planMode === 0) {
                document.getElementById("private").selected = true;
            } else {
                document.getElementById("public").selected = true;
            }
        },
        preConfirm: () => {
            let newTitle = document.getElementById("title").value;

            if (newTitle === "") {
                Swal.showValidationMessage(
                    "you must fill in the title"
                )
                return; 
            }

            let newMode = document.getElementById("mode");
            newMode = newMode.options[newMode.selectedIndex].value;

            title = newTitle;
            document.getElementById("plan-title").innerText = title;
        
            planMode = newMode;
            let modeHTML = planMode === "0" || planMode === 0 ? `<i class="fas fa-lock"></i>` : `<i class="fas fa-globe-asia"></i>`;
            document.getElementById("plan-mode").innerHTML = modeHTML;
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showDescriptionSwal = () => {
    Swal.fire({
        title: 'Edit plan description',
        input: 'textarea',
        inputValue: description,
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        preConfirm: (newDes) => {
            if (newDes === "") {
                Swal.showValidationMessage(
                    "please input a description"
                ) 
            } else {
                description = newDes;
                document.getElementById("description-div").innerHTML = `
                    <h5 class="editable" id="plan-description">${description}</h5>
                    <p class="editable-icon" data-type="description"><i class="fas fa-edit"></i></p>
                `;
                reInitializeEventListeners();
                document.getElementById("description-div").style.display = "block";
                if (document.getElementById("add-description"))
                    document.getElementById("add-description").style.display = "none";
            }   
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const showAddBookingSwal = () => {
    Swal.fire({
        title: 'Link an existing booking',
        html: `
        <h3 class="text-pink">flight bookings</h3>
        <div class="input-block input-block-abs">
            <div id="search-flight-booking-result" class="header-search-result">Loading available bookings...</div>
        </div>
        <h3 class="text-pink mt-3">hotel bookings</h3>
        <div class="input-block input-block-abs">
            <div id="search-hotel-booking-result" class="header-search-result">Loading available bookings...</div>
        </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Change',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            currentChoosingBooking = {
                flights: -1,
                hotels: -1
            };
            
            createContentBookingSwal();
        },
        preConfirm: () => {
            if (currentChoosingBooking.flights != -1) {
                chosenBookings.flights.push(availableBookings.flights[currentChoosingBooking.flights])
            }

            if (currentChoosingBooking.hotels != -1) {
                availableBookings.hotels.forEach(hotel => {
                    if (hotel.id == currentChoosingBooking.hotels) {
                        chosenBookings.hotels.push(hotel);
                    }
                })
            }

            updateBookingLinkedDetail();
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const checkSelectedFlightBookings = (id) => {
    let isReturned = false;
    chosenBookings["flights"].forEach(booking => {
        if (booking[0].booking_id == id) {
            isReturned = true;
        }
    })
    return isReturned;
}

const checkSelectedHotelBookings = (id) => {
    let isReturned = false;
    chosenBookings["hotels"].forEach(booking => {
        if (booking.id == id)
            isReturned = true;
    })
    return isReturned;
}

const createContentBookingSwal = () => {
    //Load from array and show to list
    let html = '';
    Object.keys(availableBookings.flights).forEach(booking => {
        if (!checkSelectedFlightBookings(booking)) {
            let classBooking = currentChoosingBooking["flights"] == booking? "flight-booking-disabled" : "flight-booking-enabled";
            let flightDetailHTML = '';
            availableBookings["flights"][booking].forEach(flight => {
                flightDetailHTML += `
                    <div>
                        <img src="http://pics.avs.io/80/40/${flight.flight_number.substring(0, 2)}.png">
                        ${flight.flight_number}: ${flight.origin_code} - ${flight.dest_code} (${getDisplayDateFormat(false, flight.date)})
                        <br>
                        ${flight.departure} - ${flight.arrival}
                    </div>
                `
            })
            html += `
                <div class="${classBooking}" data-id=${booking}>
                    ${flightDetailHTML}
                </div>   
            `
        }
    })
    document.getElementById("search-flight-booking-result").innerHTML = html;

    html = '';
    availableBookings.hotels.forEach(booking => {
        if (!checkSelectedHotelBookings(booking.id)) {
            let classBooking = currentChoosingBooking["hotels"] == booking.id? "hotel-booking-disabled" : "hotel-booking-enabled";
            html += `
                <div class="${classBooking}" data-id=${booking.id}>
                    <div>
                        <b>${booking.hotel_name}</b> <br>
                        ${getDisplayDateFormat(false, booking.date_start)} - ${getDisplayDateFormat(false, booking.date_end)} <br>
                        ${booking.number_of_beds} rooms
                    </div>
                </div>   
            `
        }
    })
    document.getElementById("search-hotel-booking-result").innerHTML = html;

    bookingSwalEventListeners();
}

const updateBookingLinkedDetail = () => {
    let html = ``;
    let subHTMLContent = ``;

    chosenBookings.flights.forEach(booking => {
        if (booking) {
            booking.forEach(iteration => {
                subHTMLContent += `
                    <div class="flight-booking-detail col-xl-4 col-sm-6 col-12 mb-1"
                    data-tooltip="Right click to unlink this booking" data-tooltip-location="top"
                    data-type="flight-booking-remove" data-id=${booking[0].booking_id}
                    oncontextmenu="handleClickBookingDetail(event, 'flight-booking-remove', ${booking[0].booking_id})"
                    >
                        <div class="flight-booking-detail-container d-flex flex-row">
                            <div class="d-flex flex-column align-items-center justify-content-center mr-1">
                                <div class="text-center">
                                    <img alt="" src="./../../shared/assets/images/plane.png"
                                        style="width: 30px;"
                                    >
                                    <div style="font-family: 'header'; color: #CCC6C6">
                                    ${iteration.origin_code.toLowerCase()}›${iteration.dest_code.toLowerCase()}</div>
                                </div>
                                <img src="http://pics.avs.io/80/40/${iteration.flight_number.substring(0, 2)}.png">
                            </div>
                            <div class="d-flex flex-column align-items-start justify-content-center ml-1">
                                <h5 class="text-purple" style="font-family: 'header'">${iteration.flight_number}</h5>
                                <h5 class="text-purple" style="font-family: 'header'">${getDisplayDateFormat(false, iteration.date)}</h5>
                                <h5 class="text-purple" style="font-family: 'header'">${iteration.departure} - ${iteration.arrival}</h5>
                            </div>
                        </div>
                    </div>
                `
            })
        }
    })

    document.querySelector(".flight-bookings").innerHTML = subHTMLContent;

    subHTMLContent = ``;

    chosenBookings.hotels.forEach(hotel => {
        let hotelLocation = ``;
        let splits = hotel.hotel_address.split(', ');
        hotelLocation = splits[splits.length - 1].toLowerCase();

        let dateString = "";
        let startDate = hotel.date_start.substring(5);
        splits = startDate.split('-');
        startDate = `${splits[1]}/${splits[0]}`
        dateString += startDate;
        startDate = hotel.date_end.substring(5);
        splits = startDate.split('-');
        startDate = `${splits[1]}/${splits[0]}`
        dateString += " › " + startDate;

        if (hotel) {
            subHTMLContent += `
            <div class="flight-booking-detail col-xl-4 col-sm-6 col-12 mb-1" 
            data-tooltip="Right click to unlink this booking" data-tooltip-location="bottom"
            data-type="hotel-booking-remove" data-id=${hotel.id}
            oncontextmenu="handleClickBookingDetail(event, 'hotel-booking-remove', ${hotel.id})"
            >
                <div class="flight-booking-detail-container d-flex flex-row">
                    <div class="d-flex flex-column align-items-center justify-content-center mr-1">
                        <div class="text-center">
                            <img alt="" src="./../../shared/assets/images/hotel.png"
                                style="width: 30px;"
                            >
                            <div style="font-family: 'header'; color: #CCC6C6">
                            ${hotelLocation}</div>
                        </div>
                        <img class="hotel-thumbnail" alt="" src="${hotel.hotel_image_url}">
                    </div>
                    <div class="d-flex flex-column align-items-start justify-content-center ml-1">
                        <h5 class="text-purple" style="font-family: 'header'">${dateString}</h5>
                        <h5 class="text-purple" style="font-family: 'header'; font-size: 1rem;">${hotel.hotel_name}</h5>
                    </div>
                </div>
            </div>
        `
        }
    })

    document.querySelector(".hotel-bookings").innerHTML = subHTMLContent;
}

const handleClickBookingDetail = (e, type, id) => {
    e.preventDefault();
    removeBooking(type, id);
    return false;
}

const removeBooking = (type, id) => {
    Swal.fire({
        title: 'Do you want to unlink this booking?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red'
    }).then((result) => {
        if (result.isConfirmed) {
            switch (type) {
                case "flight-booking-remove":
                    chosenBookings["flights"].forEach((booking, index) => {
                        if (booking[0].booking_id == id) {
                            chosenBookings["flights"].splice(index, 1);
                        }
                    })
                    break;
                case "hotel-booking-remove":
                    chosenBookings["hotels"].forEach((booking, index) => {
                        if (booking.id == id)
                            chosenBookings["hotels"].splice(index, 1)
                    })
                    break;
            }

            updateBookingLinkedDetail();
        }
    })
}

function recreateNode(el, withChildren) {
    if (withChildren) {
      el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
      var newEl = el.cloneNode(false);
      while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
      el.parentNode.replaceChild(newEl, el);
    }
}

const showAddDetailSwal = (day) => {
    Swal.fire({
        html: `
            <h2 class="swal2-title customized-swal-title" id="swal2-title" style="display: block;">Add a detail to day ${day}</h2>
            <div class="text-left">
                <div class="swal-close-btn" onclick="closeSwal()">
                    <h4>x</h4>
                </div>
                <label for="content" class="mr-2 mt-2 swal-label">description</label><textarea class="swal2-input" type="text" id="content" style="height: auto;" rows="3"></textarea><br>
                <div>
                    <label for="date (optional)" class="mr-2 mt-2 swal-label">date</label>
                    <input class="swal2-input" type="date" id="date"><br>
                </div>
                <div class="swal-input-grid">
                    <div>
                        <label for="time (optional)" class="mr-2 mt-2 swal-label">time</label>
                        <input class="swal2-input" type="time" id="time"><br>
                    </div>
                    <div>
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <label for="reminder-time" class="mr-2 mt-2 swal-label">remind</label>
                            <input class="mr-2 mt-2 mb-1 swal-checkbox" type="checkbox" id="remind" onchange="recheckTimeSwal()">
                        </div>
                        <input class="swal2-input" placeholder="mins before" type="number" id="reminder-time" readonly><br>
                    </div>
                </div>
                <div id="chosen-attraction" class="text-center mt-2 mb-2"></div>
                <div class="text-center">
                    <label for="destination" class="mr-2 swal-label">search for a destination, a restaurant or an activities:</label><input class="swal2-input mt-1" type="text" id="destination"></input><br>
                    <div class="input-block input-block-abs">
                        <div id="search-destination-result" class="header-search-result"></div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            let destinationSearch = document.getElementById("destination")
            destinationSearch.addEventListener("keyup", (e) => {
                if (e.target.value !== "") {
                    document.getElementById("search-destination-result").innerHTML = "Searching...";
                    checkSearchCondition(e.target, true);   
                } else {
                    document.getElementById("search-destination-result").innerHTML = "";
                }
            })
        },
        preConfirm: () => {
            let date = $('#date').val();
            let time = $('#time').val();
            let detail = $('#content').val();
            let minsBefore = $('#reminder-time').val();
            let errorText = "";

            if (choosingAttraction.id === '' && detail === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `please input at least a detail or a destination to visit.`
            }

            if ($('#remind').is(':checked') && !minsBefore && minsBefore <= 0) {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `remind time is invalid.`
            }

            if ($('#remind').is(':checked') && (time === "" || date === "")) {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `reminder is only available if you set the date and time for detail.`
            }

            if (errorText === "") {
                let detailToAdd = {
                    date: date,
                    time: time,
                    detail: detail,
                    attraction: choosingAttraction,
                    isRemind: $('#remind').is(':checked'),
                    minsBefore: minsBefore,
                    rawID: details[day - 1].length > 0? details[day - 1][details[day - 1].length - 1].rawID + 1 : 0
                }
                details[day - 1].push(detailToAdd);
                choosingAttraction = {
                    id: '',
                    name: '',
                    image: '',
                }
                printDetails();
            } else {
                Swal.showValidationMessage(
                    errorText
                ) 
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const checkSearchCondition = (box, isFrom) => {
    let tmpStoringResult = box.value;
    setTimeout(() => {
        if (box.value == tmpStoringResult) {
            searchDestination(box.value);
        }
    }, 300)
}

const searchDestination = (searchQuery) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            printDestinationSearchResults(results);
        } else {
            
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/locations/search?query=${searchQuery}&limit=30&offset=0`);
    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6");

    xhr.send();
}

const printDestinationSearchResults = (results) => {
    let resultBox = document.getElementById("search-destination-result");
    let html = ``
    results.data.forEach(result => {
        let imageSrc = result.result_object.photo? result.result_object.photo?.images.original.url : "";

        
        if (result.result_type === "things_to_do"
        || result.result_type === "restaurants"
        || result.result_type === "activities")
        {
            html += `
                <div class="destination-result" data-id="${result.result_object.location_id}" data-location="${result.result_object.name}"
                    data-image="${imageSrc}">
                    <div class="row">
                        <div class="col-md-4 col-sm-6 offset-md-0 offset-sm-3">
                            <img src="${imageSrc}" alt="" class="des-result-img">
                        </div>
                        <div class="col-md-8 col-sm-12 d-flex align-items-center justify-content-center justify-content-md-start">
                            <div class="text-md-left text-center">
                                <h5 class="text-pink">${result.result_object.name}</h5>
                                <p class="text-gray">${result.result_object.location_string}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    })
    resultBox.innerHTML = html;

    document.querySelectorAll(".destination-result").forEach(result => {
        result.addEventListener("click", () => {
            let id = result.getAttribute("data-id");
            let name = result.getAttribute("data-location");
            let image = result.getAttribute("data-image");
            choosingAttraction = {
                id: id,
                name: name,
                image: image,
            }
            document.getElementById("chosen-attraction").innerHTML = `
                <div class="mdc-chip" role="row" data-id = ${id}>
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${name}</span>
                        </span>
                    </span>
                    <span role="gridcell">
                        <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                        onclick = "deleteSelectedDestination(event)">cancel</i>
                    </span>
                </div>
            `
            resultBox.innerHTML = "";
            document.getElementById("destination").value = "";
        })
    })
}

const deleteSelectedDestination = (e) => {
    let getParent = e.target.closest(".mdc-chip");
    let getID = getParent.getAttribute("data-id");
    choosingAttraction = {
        id: '',
        name: '',
        image: '',
    }
    document.getElementById("chosen-attraction").innerHTML = "";
}

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
                planMode = result.mode;
                gatherColabs();
                
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

    const gatherColabs = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanColabs&user_id=${uid}&plan_id=${planID}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
               //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                colabs = result;
                colabs.forEach(colab => {
                    if (!Object.keys(colab).includes("id")) {
                        colab["id"] = colab["user_id"];
                    }
                })
                reDisplayColabs();
                gatherLocations();
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

    const gatherLocations = () => {
        let csrf = document.getElementById("csrf").innerText;
        let xhr = new XMLHttpRequest();
        xhr.open(
            "GET",
            `../../api/plans/plans.php?getPlanLocations&user_id=${uid}&plan_id=${planID}&csrf=${csrf}`,
            true
        )
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
               //Nhận thông tin và lưu vào danh mục
                let result = JSON.parse(xhr.responseText); 
                wrapperLocations = result;
                reDisplayWrapperLocations();
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
                    let date_order = result.date_order;
                    if (details.length <= date_order) {
                        details.push([]);
                    }
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
                        rawID: result.time_order,
                        minsBefore: result.minute_alarm,
                    }
                    details[date_order].push(detailToAdd);
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
    
    let modeHTML = planMode === 0 || planMode === "0" ? `<i class="fas fa-lock"></i>` : `<i class="fas fa-globe-asia"></i>`;
    document.getElementById("plan-mode").innerHTML = modeHTML;
    
    if (description == "") {
        document.getElementById("description-div").style.display = "none";
    } else {
        document.getElementById("plan-description").innerText = description;
        document.getElementById("description-div").style.display = "block";
        document.getElementById("add-description").style.display = "none";
    }

    document.getElementById("plan-created").innerText = `updated: ${getDisplayDateFormat(false, created)}`;

    updateBookingLinkedDetail();

    printDetails();
} 

const printDetails = () => {
    let detailsBox = document.getElementById("details");
    detailsBox.innerHTML = "";
    let html = "";

    details.forEach((detailsOfDay, index) => {
        let dayDetailsHTML = ``;
        detailsOfDay.forEach(detail => {

            let detailHTML = ``;
            if (detail.time !== "" || detail.detail !== "") {
                detailHTML += `<div class='detail-time-div ${detail.isRemind ? 'time-div-remind' : 'time-div-not-remind'}'>`
                let detailContent = ``;
                if (detail.detail !== "") {
                    if (detail.time !== "")
                        detailContent = `· ${detail.detail}`
                    else
                        detailContent = `${detail.detail}`
                }

                detailHTML += `
                    <span  style="font-family: 'header'">
                        <i style="color: ${!detail.isRemind ? 'var(--theme-purple);' : 'white'}" class="fas fa-clock"></i>
                        ${detail.time}
                        ${detailContent}
                    </span>
                `

                detailHTML += "</div>";
            }

            let alarmClass = "";
            let attractionClass = "";
            if (detail.isRemind)
                alarmClass = '<span class="mr-1"><i class="fas fa-clock"></i></span>'
            if (detail.attraction.id)
                attractionClass = `
                    <div class="mb-2 mt-2 plan-detail-attraction" style="background: white;">
                        <div class="img-div" style="width: 60px; height: 60px; object-fit: cover;
                        background-image: url('${detail.attraction.image}')
                        " data-id=${detail.rawID} data-day=${index} 
                        onClick="showEditDetail(${index}, ${detail.rawID});"></div>
                        
                        <div>
                            ${detailHTML}
                        </div>
                        
                        <span class="d-flex align-items-center detail-attraction-div" style="display: inline-flex !important">
                            <i class="fa fa-map-marker-alt mr-1" aria-hidden="true"></i>
                            <a class="destination" target="blank" 
                            href="../../attraction/attraction.php?id=${detail.attraction.id}">${detail.attraction.name}</a>
                        </span>
                    </div>
                `

                if (detail.attraction.id)
                dayDetailsHTML += `
                    <div class="mb-2 mt-2 editable-container left-container draggable" draggable="true"
                    data-day=${index}>
                        ${attractionClass}
                    </div>
                `
            else {

                let divContent = ``;

                divContent += `<div class='detail-all-div ${detail.isRemind ? 'detail-all-remind' : 'detail-all-not-remind'}'>`
                let detailContent = ``;
                if (detail.detail !== "") {
                    if (detail.time !== "")
                        detailContent = `· ${detail.detail}`
                    else
                        detailContent = `${detail.detail}`
                }

                divContent += `
                <span style="font-family: 'header'">
                    <i style="color: ${!detail.isRemind ? 'var(--theme-purple);' : 'white'}" class="fas fa-clock"></i>
                    ${detail.time}
                    ${detailContent}
                </span>`

                divContent += "</div>"

                if (detail.isRemind) {
                    dayDetailsHTML += `
                        <div class="mb-2 mt-2 editable-container left-container draggable" draggable="true"
                        data-day=${index} data-id=${detail.rawID}
                        onClick="showEditDetail(${index}, ${detail.rawID});">
                            ${divContent}
                        </div>
                `
                } else {
                    dayDetailsHTML += `
                        <div class="mb-2 mt-2 editable-container left-container draggable" draggable="true"
                        data-day=${index} data-id=${detail.rawID}
                        onClick="showEditDetail(${index}, ${detail.rawID});">
                            ${divContent}
                        </div>
                    `
                }
            }

            // dayDetailsHTML += `
            //     <div class="editable-container left-container draggable" draggable="true"
            //     data-day=${index}>
            //         ${timeHTML}
            //         ${attractionClass}
            //         <p class="editable-icon editable-icon-detail" data-type="detail" 
            //         data-day=${index} data-id=${detail.rawID}><i class="fas fa-edit"></i></p>
            //         <p class="editable-icon editable-icon-detail remove-icon editable-detail-remove" data-type="flight-booking-remove" 
            //         data-day=${index} data-id=${detail.rawID}>
            //         <i class="fa fa-trash" aria-hidden="true"></i></p>
            //     </div>
            // `   
        })
        html += `
            <div id="day-${index + 1}" class="day-draggable mt-3 mb-3 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12" >
                <div class="editable-container text-left day-div">
                    <h4 class="text-purple text-left">day ${index + 1}</h4>
                    <p class="editable-icon" data-day=${index + 1} data-type="day-delete"><i class="fas fa-trash"></i></p>
                </div>
                

                <div class="details" data-day="${index}">
                    ${dayDetailsHTML}
                </div>

                <div class="add-detail-day-div" data-day=${index + 1}
                data-tooltip="Add a detail to day ${index + 1}" data-tooltip-location="bottom"
                onClick="showAddDetailSwal(${index + 1});">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                </div>
            </div>
        `

        
    })
    
    /*
       <p class="editable-icon-show add-detail"
                data-day=${index + 1}
                data-tooltip="Add a detail to day ${index + 1}" data-tooltip-location="right"><i class="fa fa-plus" aria-hidden="true">
                </i></p>
    */

    detailsBox.innerHTML = html;

    document.querySelectorAll(".add-detail").forEach(btn => {
        btn.addEventListener("click", () => {
            showAddDetailSwal(btn.getAttribute("data-day"));
    })});


    detailsBox.querySelectorAll(".editable-icon-detail").forEach(icon => {
        icon.addEventListener("click", () => {
            let id = icon.getAttribute("data-id");
            let day = icon.getAttribute("data-day");
            
            if (icon.classList.contains("remove-icon")) {
                showDeleteDetailConfirmation(id);
            } else {
                showEditDetail(day, id);
            }
        })
    })

    detailsBox.querySelectorAll(".editable-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            let type = icon.getAttribute("data-type");
            if (type === "day-delete") {
                let day = icon.getAttribute("data-day");
                showDayDeleteSwal(day);
            } 
        })
    })

    document.querySelectorAll(".day-draggable .details").forEach(el => {
        new Sortable(el, {
            animation: 150,
            ghostClass: 'blue-background-class',
            onStart: function (evt) {
                evt.oldIndex; 
            },
            onEnd: function (evt) {
                performChangeDetails(evt.oldIndex, evt.newIndex, el.getAttribute("data-day"));
            },
        });
    });
}

const showDayDeleteSwal = (day) => {
    Swal.fire({
        title: 'Are you sure want to delete this day?',
        text: 'All details within the day will also be deleted.',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red'
    }).then((result) => {
        if (result.isConfirmed) {
            details.splice(day - 1, 1);
            printDetails();
        }
    })
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

const performChangeDetails = (oldIndex, newIndex, day) => {
    let tmpDetail = details[day][oldIndex];
    details[day][oldIndex] = details[day][newIndex];
    details[day][newIndex] = tmpDetail;
}

const closeSwal = () => {
    Swal.close();
}

const showEditDetail = (day, detailID) => {
    let choosingDetail;
    let getDay = day;
    for (let j = 0; j < details[day].length; j++) {
        if (details[day][j].rawID == detailID) {
            choosingDetail = details[day][j];
            break;
        }
    }   

    Swal.fire({
        html: `
            <h2 class="swal2-title customized-swal-title" id="swal2-title" style="display: block;">Edit a detail</h2>
            <div class="text-left">
                <div class="swal-close-btn" onclick="closeSwal()">
                    <h4>x</h4>
                </div>
                <label for="content" class="mr-2 mt-2 swal-label">description</label><textarea class="swal2-input" type="text" id="content" style="height: auto;" rows="3"></textarea><br>
                <div>
                    <label for="date (optional)" class="mr-2 mt-2 swal-label">date</label>
                    <input class="swal2-input" type="date" id="date"><br>
                </div>
                <div class="swal-input-grid">
                    <div>
                        <label for="time (optional)" class="mr-2 mt-2 swal-label">time</label>
                        <input class="swal2-input" type="time" id="time"><br>
                    </div>
                    <div>
                        <div class="d-flex flex-row justify-content-between align-items-center">
                            <label for="reminder-time" class="mr-2 mt-2 swal-label">remind</label>
                            <input class="mr-2 mt-2 mb-1 swal-checkbox" type="checkbox" id="remind" onchange="recheckTimeSwal()">
                        </div>
                        <input class="swal2-input" placeholder="mins before" type="number" id="reminder-time" readonly><br>
                    </div>
                </div>
                <div id="chosen-attraction" class="text-center mt-2 mb-2"></div>
                <div class="text-center">
                    <label for="destination" class="mr-2 swal-label">search for a destination, a restaurant or an activities:</label><input class="swal2-input mt-1" type="text" id="destination"></input><br>
                    <div class="input-block input-block-abs">
                        <div id="search-destination-result" class="header-search-result"></div>
                    </div>
                </div>
                <button type="button" class="swal2-confirm swal2-styled swal2-default-outline" style="display: inline-block; background-color: red; width: 97.5%" aria-label=""
                onclick="showDeleteDetailConfirmation(${detailID})">Delete this detail</button>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            let destinationSearch = document.getElementById("destination")
            destinationSearch.addEventListener("keyup", (e) => {
                if (e.target.value !== "") {
                    document.getElementById("search-destination-result").innerHTML = "Searching...";
                    checkSearchCondition(e.target, true);   
                } else {
                    document.getElementById("search-destination-result").innerHTML = "";
                }
            })

            $('#date').val(choosingDetail.date);
            $('#time').val(choosingDetail.time);
            $('#content').val(choosingDetail.detail);
            $('#remind').prop('checked', choosingDetail.isRemind);
            $('#reminder-time').val(choosingDetail.minsBefore);

            if (choosingDetail.attraction.id != '') {
                choosingAttraction = choosingDetail.attraction;
                document.getElementById("chosen-attraction").innerHTML = `
                    <div class="mdc-chip" role="row" data-id = ${choosingAttraction.id}>
                        <div class="mdc-chip__ripple"></div>
                        <img class="mdc-chip__icon mdc-chip__icon--leading" src="${choosingAttraction.image}"></img>
                        <span role="gridcell">
                            <span role="button" tabindex="0" class="mdc-chip__primary-action">
                                <span class="mdc-chip__text">${choosingAttraction.name}</span>
                            </span>
                        </span>
                        <span role="gridcell">
                            <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                            onclick = "deleteSelectedDestination(event)">cancel</i>
                        </span>
                    </div>
                `
            }

        },
        preConfirm: () => {
            let date = $('#date').val();
            let time = $('#time').val();
            let detail = $('#content').val();
            let minsBefore = $('#reminder-time').val();
            let errorText = "";

            if (choosingAttraction.id === '' && detail === "") {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `please input at least a detail or a destination to visit.`
            }

            if ($('#remind').is(':checked') && !minsBefore && minsBefore <= 0) {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `remind time is invalid.`
            }

            if ($('#remind').is(':checked') && (time === "" || date === "")) {
                if (errorText !== "")
                    errorText += '<br>'   
                errorText += `reminder is only available if you set the date and time for detail.`
            }

            if (errorText === "") {
                let detailToAdd = {
                    date: date,
                    time: time,
                    detail: detail,
                    attraction: choosingAttraction,
                    isRemind: $('#remind').is(':checked'),
                    minsBefore: minsBefore,
                    rawID: details[getDay].length > 0? details[getDay][details[getDay].length - 1].rawID + 1 : 0
                }

                for (let i = 0; i < details.length; i++) {
                    for (let j = 0; j < details[i].length; j++) {
                        if (details[i][j].rawID == detailID) {
                            details[i][j] = detailToAdd;
                            break;
                        }
                    }   
                }

                choosingAttraction = {
                    id: '',
                    name: '',
                    image: '',
                }
                printDetails();
            } else {
                Swal.showValidationMessage(
                    errorText
                ) 
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}
const showDeleteDetailConfirmation = (detailID) => {
    Swal.fire({
        title: 'Do you want to delete this detail?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red'
    }).then((result) => {
        if (result.isConfirmed) {
            for (let i = 0; i < details.length; i++) {
                if (details[i].rawID == detailID) {
                    details.splice(i, 1);
                    break;
                }
            }
            printDetails();
        }
    })
}

const bookingSwalEventListeners = () => {
    document.querySelectorAll('.flight-booking-enabled').forEach(item => {
        item.addEventListener("click", () => {
            let id = item.getAttribute("data-id");
            currentChoosingBooking.flights = id;

            createContentBookingSwal();
        })
    })

    document.querySelectorAll('.flight-booking-disabled').forEach(item => {
        item.addEventListener("click", () => {
            currentChoosingBooking.flights = -1;

            createContentBookingSwal();
        })
    })

    document.querySelectorAll('.hotel-booking-disabled').forEach(item => {
        item.addEventListener("click", () => {
            currentChoosingBooking.hotels = -1;

            createContentBookingSwal();
        })
    })

    document.querySelectorAll('.hotel-booking-enabled').forEach(item => {
        item.addEventListener("click", () => {
            let id = item.getAttribute("data-id");
            currentChoosingBooking.hotels = id;

            createContentBookingSwal();
        })
    })
}

const savePlan = () => {
    const sendDetails = (newPlanID) => {
        //Add booking info to table
        //Get csrf
        let csrf = "";
        csrf = document.getElementById("csrf").innerText;
    
        let xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "../../api/plans/create.php",
            true
        )
    
        let sendData = [];

        details.forEach((detailsOfDay, index) => {
            detailsOfDay.forEach((detail, indexDay) => {
                let detailStorage = {
                    "plan_id": newPlanID,
                    "destination_id": detail.attraction.id,
                    "destination_name": detail.attraction.name,
                    "destination_image": detail.attraction.image,
                    "detail": detail.detail,
                    "date": detail.date,
                    "start": detail.time,
                    "set_alarmed": detail.isRemind,
                    "minute_alarm": detail.minsBefore,
                    "date_order": index,
                    "time_order": indexDay
                }   

                sendData.push(detailStorage)
            })
        })
    
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            swal.close();
            if (xhr.status === 200 && xhr.readyState === 4) {
                //Booking complete
                deletePlan(planID, true);
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Error occured. Please try again later."
                });
                deletePlan(newPlanID, false);
            }
        }
        xhr.send(`planDetails&data=${encodeURIComponent(JSON.stringify(sendData))}&csrf=${csrf}`);
    }

    const reAddNewPlan = () => {
        //Add booking info to table
        //Get csrf
        let csrf = "";
        csrf = document.getElementById("csrf").innerText;

        let flightIndexes = [];
        let hotelIndexes = [];

        chosenBookings.flights.forEach(booking => {
            if (booking[0])
                flightIndexes.push(booking[0]["booking_id"]);
        })

        chosenBookings.hotels.forEach(booking => {
            if (booking["id"])
                hotelIndexes.push(booking["id"]);
        })

        let defaultColabs = colabs;
        defaultColabs.forEach(colab => {
            if (!Object.keys(colab).includes("user_id")) {
                colab["user_id"] = colab["id"];
            }
        })

        let data = {
            "user_id": uid,
            "plan_title": `${title}`,
            "description": `${description}`,
            "flight_id": `${flightIndexes.toString()}`,
            "hotel_id": `${hotelIndexes.toString()}`,
            "from_date": `${fromDate}`,
            "to_date": `${toDate}`,
            "mode": planMode
        }

        let xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            "../../api/plans/create.php",
            true
        )
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = () => {
            if (xhr.status === 200 && xhr.readyState === 4) {
                let planID = parseInt(xhr.responseText);
                sendDetails(planID);
            } else {
                swal.close();
                Swal.fire({
                    icon: "error",
                    text: "Error occured. Please try again later."
                });
            }
        }
        xhr.send(`planInfo&isEdit=${planID}&data=${encodeURIComponent(JSON.stringify(data))}&locations=${encodeURIComponent(JSON.stringify(wrapperLocations))}&colabs=${encodeURIComponent(JSON.stringify(defaultColabs))}&csrf=${csrf}`);
    }

    if (title == "") {
        swal.close();
        Swal.fire({
            icon: "error",
            text: "Please fill in at least title of the plan."
        });
        return;
    }

    if (planMode === "0" || planMode === 0) {
        swal.close();
        Swal.fire({
            title: 'Are you sure want to proceed?',
            text: 'Saving the plan as private mode will lose all the linked plan in posts at Tour Guru blog.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
            didOpen: () => {
                document.querySelector(".swal2-confirm").style.display = "flex";
                document.querySelector(".swal2-loader").style.display = "none";
            }
        }).then((result) => {
            if (result.isConfirmed) {
                reAddNewPlan();  
            }
        })
    } else {
        reAddNewPlan();  
    }
}

const deletePlan = async (id, isRedirect) => {
    //Add booking info to table
    //Get csrf
    let csrf = "";
    csrf = document.getElementById("csrf").innerText;

    let xhr = new XMLHttpRequest();
    xhr.open(
        "POST",
        "../../api/plans/plans.php",
        true
    )
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
        if (xhr.status === 200 && xhr.readyState === 4) {
            if (isRedirect) {
                Swal.fire({
                    title: 'Plan has been edited successfully.',
                    icon: 'success'
                }).then(() => {
                    location.replace("./../");
                })
            }
        } else {
            swal.close();
            Swal.fire({
                icon: "error",
                text: "Error occured. Please try again later."
            });
        }
    }

    xhr.send(`deletePlan&planID=${id}&uid=${uid}&csrf=${csrf}`);
}

const showAddWrapperLocationsSwal = () => {
    Swal.fire({
        title: 'Add a city or country',
        html: `
            <div class="text-left">
                <div id="current-wrapper-location" class="mt-2 mb-2">
                    <span id="wrapper-locations-list"></span>
                </div>
                <div id="chosen-wrapper-location" class="text-center mt-2 mb-2"></div>
                <div class="text-center">
                    <label for="wrapper-location" class="mr-2">search for a city or country:</label><input class="swal2-input mt-1" type="text" id="wrapper-location"></input><br>
                    <div class="input-block input-block-abs mt-2">
                        <div id="search-wrapper-location-result" class="header-search-result"></div>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Add',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        showLoaderOnConfirm: true,
        didOpen: () => {
            let wrapperLocationSearch = document.getElementById("wrapper-location")
            wrapperLocationSearch.addEventListener("keyup", (e) => {
                if (e.target.value !== "") {
                    document.getElementById("search-wrapper-location-result").innerHTML = "Searching...";
                    checkSearchWrapperLocationCondition(e.target, true);   
                } else {
                    document.getElementById("search-wrapper-location-result").innerHTML = "";
                }
            })

            let wrapperLocationsList = document.getElementById("wrapper-locations-list");
            let listHTML = ``;
            wrapperLocations.forEach(location => {
                listHTML += `<div class="mdc-chip" role="row" data-id = ${location.location_id}>
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${location.location_image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${location.location_name}</span>
                        </span>
                    </span>
                    <span role="gridcell">
                        <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                        onclick = "deleteSelectedWrapperLocation(event)">cancel</i>
                    </span>
                </div>`
            })
            wrapperLocationsList.innerHTML = listHTML;
        },
        preConfirm: () => {
            if (choosingWrapperLocation.location_id !== "") {
                wrapperLocations.push(choosingWrapperLocation);

                reDisplayWrapperLocations();
            }
            choosingWrapperLocation = {
                location_id: '',
                location_name: '',
                location_image: '',
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })
}

const checkSearchWrapperLocationCondition = (box, isFrom) => {
    let tmpStoringResult = box.value;
    setTimeout(() => {
        if (box.value == tmpStoringResult) {
            searchWrapperLocation(box.value);
        }
    }, 300)
}

const searchWrapperLocation = (searchQuery) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(this.status == 200) {
            let results = JSON.parse(xhr.responseText);
            printWrapperLocationSearchResults(results);
        } else {
            
        }
    }

    xhr.open("GET", `https://travel-advisor.p.rapidapi.com/locations/search?query=${searchQuery}&limit=30&offset=0`);
    xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6");

    xhr.send();
}

const reDisplayWrapperLocations = () => {
    let wrapperLocationsList = document.getElementById("wrapper-locations-display");
    let listHTML = ``;
    wrapperLocations.forEach(location => {
        listHTML += `<div class="mdc-chip" role="row" data-id = ${location.location_id}>
            <div class="mdc-chip__ripple"></div>
            <img class="mdc-chip__icon mdc-chip__icon--leading" src="${location.location_image}"></img>
            <span role="gridcell">
                <span role="button" tabindex="0" class="mdc-chip__primary-action">
                    <span class="mdc-chip__text">${location.location_name }</span>
                </span>
            </span>
        </div>`
    })
    wrapperLocationsList.innerHTML = listHTML;

    if (wrapperLocations.length > 0) {
        document.querySelector(".wrapper-location-editable").style.right = "-10px";
    } else {
        document.querySelector(".wrapper-location-editable").style.right = "unset";
    }
}

const printWrapperLocationSearchResults = (results) => {
    let resultBox = document.getElementById("search-wrapper-location-result");
    let html = ``
    results.data.forEach(result => {
        let found = false;

        wrapperLocations.forEach(location => {
            if (result.result_object.location_id === location.id) {
                found = true;
            }
        });

        if (!found) {
            let imageSrc = result.result_object.photo? result.result_object.photo?.images.original.url : "";

            if (result.result_type === "geos")
            {
                html += `
                    <div class="wrapper-location-result" data-id="${result.result_object.location_id}" data-name="${result.result_object.name}"
                        data-image="${imageSrc}">
                        <div class="row">
                            <div class="col-md-4 col-sm-6 offset-md-0 offset-sm-3">
                                <img src="${imageSrc}" alt="" class="des-result-img">
                            </div>
                            <div class="col-md-8 col-sm-12 d-flex align-items-center justify-content-center justify-content-md-start">
                                <div class="text-md-left text-center">
                                    <h5 class="text-pink">${result.result_object.name}</h5>
                                    <p class="text-gray mb-1">${result.result_object.location_string}</p>
                                    <p class="text-gray font-italic mb-1">${result.result_object.subcategory[0].name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    })

    resultBox.innerHTML = html;

    document.querySelectorAll(".wrapper-location-result").forEach(result => {
        result.addEventListener("click", () => {
            let id = result.getAttribute("data-id");
            let name = result.getAttribute("data-name");
            let image = result.getAttribute("data-image");
            choosingWrapperLocation = {
                location_id: id,
                location_name: name,
                location_image: image,
            }
            document.getElementById("chosen-wrapper-location").innerHTML = `
                <div class="mdc-chip" role="row" data-id = ${id}>
                    <div class="mdc-chip__ripple"></div>
                    <img class="mdc-chip__icon mdc-chip__icon--leading" src="${image}"></img>
                    <span role="gridcell">
                        <span role="button" tabindex="0" class="mdc-chip__primary-action">
                            <span class="mdc-chip__text">${name}</span>
                        </span>
                    </span>
                    <span role="gridcell">
                        <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                        onclick = "deleteSelectedWrapperLocation(event)">cancel</i>
                    </span>
                </div>
            `
            resultBox.innerHTML = "";
            document.getElementById("wrapper-location").value = "";
        })
    })
}

const deleteSelectedWrapperLocation = (e) => {
    let getParent = e.target.closest(".mdc-chip");
    let getID = getParent.getAttribute("data-id");

    choosingWrapperLocation = {
        location_id: '',
        location_name: '',
        location_image: '',
    }

    let newWrapperLocations = [];
    wrapperLocations.forEach(wrapperLocation => {
        if (wrapperLocation.location_id != getID) {
            newWrapperLocations.push(wrapperLocations);
        }
    })
    wrapperLocations = newWrapperLocations;
    let wrapperLocationsList = document.getElementById("wrapper-locations-list");
    let listHTML = ``;
    wrapperLocations.forEach(wrapperLocation => {
        listHTML += `<div class="mdc-chip" role="row" data-id = ${wrapperLocation.location_id}>
            <div class="mdc-chip__ripple"></div>
            <img class="mdc-chip__icon mdc-chip__icon--leading" src="${wrapperLocation.location_image}"></img>
            <span role="gridcell">
                <span role="button" tabindex="0" class="mdc-chip__primary-action">
                    <span class="mdc-chip__text">${wrapperLocation.location_name}</span>
                </span>
            </span>
            <span role="gridcell">
                <i class="chip-delete material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="-1" role="button"
                onclick = "deleteSelectedWrapperLocation(event)">cancel</i>
            </span>
        </div>`
    })
    wrapperLocationsList.innerHTML = listHTML;

    reDisplayWrapperLocations();

    document.getElementById("chosen-wrapper-location").innerHTML = "";
}