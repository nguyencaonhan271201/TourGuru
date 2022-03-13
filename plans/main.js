let uid;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        
            getPlans();
        } else {
            location.replace("./../auth/login.php");
            return;
        }
    })

    
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

const getPlans = () => {
    let csrf = document.getElementById("csrf").innerText;
    let xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `../api/plans/plans.php?getPlans&id=${uid}&csrf=${csrf}`,
        true
    )
    xhr.onload = () => {
        swal.close();
        if (xhr.status === 200 && xhr.readyState === 4) {
            //Nhận thông tin và lưu vào danh mục
            let result = JSON.parse(xhr.responseText); 
            printPlansToDisplay(result);
            Swal.close();
        } else {
            Swal.fire({
                icon: "error",
                text: "Error occured."
            }).then(() => {
                location.replace("./../");
            });
        }
    }
    xhr.send();
}

const printPlansToDisplay = (result) => {
    let container = document.querySelector(".plans");

    if (result.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="width: 100%">
                <h4 class="text-purple text-center">you have no plans. why not create one now?</h4>
            </div>
        `;
        return;
    }

    container.innerHTML = "";
    result.forEach(plan => {
        let planModeHTML = plan.mode === 0? `<i class="fas fa-lock"></i>` : `<i class="fas fa-globe-asia"></i>`;
        let locations = '';
        let locationsHTML ='';
        if (plan.locations.length > 0) {
            for (let i = 0; i < plan.locations.length; i++) {
                locations += ', ' + plan.locations[i].location_name;
            }

            locations = locations.slice(2);

            locationsHTML = `<p class="text-light-gray mb-2"><i class="fas fa-map-marker-alt"></i> ${locations}</p>`;
        }
        let colabsImages = ``;
        plan.colabs.forEach((colab, index) => {
            colabsImages += `
                <img 
                    src=${colab.image.replace('../../', '../')}
                    alt=""
                    style="z-index: ${plan.colabs.length - index}"
                >
            `
        });

        container.innerHTML += `
            <div class="col-xl-4 col-sm-6 col-12 plan-container">
                <div class="plan d-flex  flex-column align-items-start justify-content-center" data-plan-id=${plan.id}>
                    <h1 class="text-purple">${plan.plan_title}
                        <span class="text-tiny">
                            ${planModeHTML}
                        </span>
                    </h1>
                    ${locationsHTML}
                    <h5 class="text-purple mb-2"><i class="fas fa-clock"></i> ${plan.numberOfDays} ${plan.numberOfDays === 1? "day" : "days"}</h5>
                    <div class="colabs mt-2">
                        ${colabsImages}
                    </div>
                </div>
            </div>
        `
    })

    document.querySelectorAll(".plan").forEach(button => {
        button.addEventListener("click", () => {
            let id = button.getAttribute("data-plan-id");
            location.replace(`./plan?id=${id}`);
        })
    })
}

//Testing only
const dummyData = () => {
    printPlansToDisplay([
        {
            id: 1,
            plan_title: 'hanoi hanoi hanoi',
            description: 'hola welcome to the capital for the first time',
            from_date: '2020-11-27',
            to_date: '2020-11-30',
            date_created: '2021-11-01'
        },
        {
            id: 2,
            plan_title: 'hanoi hanoi hanoi',
            description: 'hola welcome to the capital for the first time',
            from_date: '2020-11-27',
            to_date: '2020-11-30',
            date_created: '2021-11-01'
        }
    ]);
}