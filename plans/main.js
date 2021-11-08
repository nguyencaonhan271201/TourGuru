let uid;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;

            Swal.fire({
                title: 'Loading...',
                html: 'Please wait...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading()
                }
            });
        
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
                //location.replace("./../");
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
        container.innerHTML += `
            <div class="col-md-4 col-sm-6 col-12 plan-container">
                <div class="plan text-center">
                    <h3 class="text-pink">${plan.plan_title}</h3>
                    <h5 class="text-purple">${getDisplayDateFormat(false, plan.from_date)} - ${getDisplayDateFormat(false, plan.to_date)}</h5>
                    <p class="">${plan.description}</p>
                    <p class="text-gray font-italic">created: ${getDisplayDateFormatAdd7Hours(plan.date_created)}</p>
                    <button class="btn-view" data-plan-id=${plan.id}>view</button>
                </div>
            </div>
        `
    })

    document.querySelectorAll(".btn-view").forEach(button => {
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