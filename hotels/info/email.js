let css = `
<style>
@font-face {
    font-family: "header";
    src: url("../shared/assets/fonts/header.TTF") format("truetype");
}

@font-face {
    font-family: "body";
    src: url("../shared/assets/fonts/body.TTF") format("truetype");
}

p,
span,
button,
h5,
input {
    font-family: "body1", sans-serif;
}

h1,
h2,
h3,
h4 {
    font-family: "header1", sans-serif;
}

:root {
    --theme-purple: #a082af;
    --theme-dark-purple: #876897;
    --theme-text-dark-purple: rgb(103, 99, 168);
    --theme-text-dark-purple-hover: rgb(82, 79, 139);
    --theme-invalid: #e5b7d1;
    --theme-dark-border: #818181;
    --theme-light-border: #cccccc;
    --theme-input-border: rgb(229, 229, 229);
    --theme-text-light-grey: rgb(127, 127, 127);
    --theme-text-lighter: rgb(204, 198, 198);
    --theme-link: #00c2b1;
    --theme-link-hover: rgb(1, 163, 150);
    --theme-pink: #c95998;
    --theme-dark-pink: #a03d75;
}

#horizontal-upper-form-div select {
    background: none !important;
    border: none !important;
    margin-right: 10px;
}

#main-search-form {
    background: white;
    border: 2px solid var(--theme-purple);
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 2em;
}

#main-search-form .d-flex,
#main-search-form .d-flex .input-block {
    height: 100%;
    width: 100%;
}

#main-search-form .d-flex .input-block,
#main-search-form .d-flex .input-block-m {
    background: white;
    margin-right: 5px;
    border-radius: 2em;
}

.input-block input {
    border: none;
    height: 100%;
    width: 100%;
    border-radius: 5px;
}

.input-block input:focus,
.input-block-m button:focus {
    outline: none !important;
    border: none;
}

input[type="date"]:after {
    content: attr(placeholder);
}

.input-block {
    flex-grow: 1;
}

.input-block-active {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
}

#btn-search {
    height: 100%;
    width: 100%;
    background: none;
    border: none;
    color: white;
}

.btn-search-block {
    background: var(--theme-pink) !important;
    border-radius: 5px;
    margin-right: 0px !important;
    transition: background 300ms;
}

.btn-search-block:hover {
    background: var(--theme-dark-pink) !important;
}

.col-md-5.col-sm-12.d-flex.pr-0 {
    height: 100%;
}

.search-div {
    height: 70vh;
    transition: height 300ms;
}

.header-search-result {
    position: absolute;
    max-height: 200px;
    height: auto;
    min-height: 40px;
    background: white;
    width: 95%;
    margin-left: 2.5%;
    overflow-y: auto;
    overflow-x: hidden;
    display: none;
    flex-direction: column;
    z-index: 10;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.header-search-result:hover {
    display: flex;
    opacity: 1;
}

.header-search:focus + .header-search-result {
    display: flex;
}

.header-search-result * {
    text-decoration: none;
}

.input-block-abs {
    position: relative;
}

.search-result {
    padding: 5px;
    word-break: break-all;
    word-wrap: break-word;
}

.search-result:hover {
    background: lightgrey;
    cursor: pointer;
}

.search-div-found {
    height: auto;
    margin-bottom: 30px;
}

.highlighted {
    background: lightblue;
}

#location-title-h2 {
    color: var(--theme-pink);
    margin-bottom: 30px;
}

.hotel-option-box {
    border: 2px solid var(--theme-pink);
    padding: 10px 20px;
    border-radius: 10px;
    margin: 20px 0px;
    position: relative;
}

.button-choose {
    border-radius: 2em;
    padding: 5px;
    color: white;
    border: none;
    background: darkgrey;
    transition: background 300ms;
}

.button-choose:hover {
    background: var(--theme-pink);
}

.chosen {
    background: var(--theme-dark-pink);
}

.btn-full {
    width: 100%;
    height: auto;
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.hotel-option-image {
    width: 175px;
    height: 175px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
    border: 1px solid grey;
}

.hotel-option-name {
    color: var(--theme-purple);
    font-size: 1.5rem;
}

.text-gray {
    color: gray;
    font-size: 0.8em;
}

.total-price {
    color: var(--theme-pink) !important;
    font-size: 1.5rem;
}

.hotel-option-star {
    font-size: 1rem;
}

.rating-star {
    color: rgb(223, 167, 25);
}

.hotel-option-rating {
    background: var(--theme-pink);
    color: white;
    padding: 10px;
    position: absolute;
    top: 10px;
    right: 10px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}

.page-item.active .page-link {
    background-color: var(--theme-purple) !important;
    border-color: var(--theme-purple) !important;
    color: white !important;
}

.page-link {
    color: var(--theme-purple) !important;
}

#sort {
    background: none !important;
    border: none !important;
    margin-right: 10px;
}

.summary-box {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    padding: 15px;
    border-radius: 5px;
    border: none;
    height: fit-content;
}

.overlap-hr {
    margin: 10px -15px;
}

.star-checkbox {
    height: 20px;
    width: 20px;
    margin-right: 5px;
    margin-bottom: 0px;
}

.filter-star {
    color: rgb(223, 167, 25);
    font-size: 19px;
}

.text-purple {
    color: var(--theme-dark-purple);
}

@media screen and (max-width: 768px) {
    #main-search-form {
        height: 180px;
    }

    #main-search-form .d-flex,
    #main-search-form .d-flex .input-block {
        height: 50px;
    }

    .right-most {
        margin-right: 0px !important;
    }

    .hotel-option-image {
        width: 150px;
        height: 150px;
    }

    .hotel-option-rating {
        position: relative;
        right: 0;
        width: fit-content;
    }

    .btn-full {
        position: relative;
        bottom: 0;
        right: 0;
    }
}

@font-face {
    font-family: "header1";
    src: url("https://dl.dropboxusercontent.com/s/ctc5ty7y633gjqf/header.TTF?dl=1")
        format("truetype");
}

@font-face {
    font-family: "body1";
    src: url("https://dl.dropboxusercontent.com/s/g7az3lg4k1cdj6j/body.TTF?dl=1")
        format("truetype");
}

p,
span,
button,
input {
    font-family: "body1";
}

h1,
h2,
h3,
h4,
h5 {
    font-family: "header1";
}

.booking-detail {
    padding: 30px;
    width: 1000px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
}

.agency-name {
    display: flex;
    align-items: center;
    color: #a082af;
}

.text-purple {
    color: #a082af;
}

.agency-detail {
    text-align: center;
    display: flex;
    justify-content: center;
}

#agency-logo {
    width: 100px;
    height: 100px;
}

.boarding-pass {
    border-radius: 10px;
    border: 2px solid #a082af;
    display: flex;
    padding: 10px;
}

.flight-detail {
    flex-grow: 3;
    flex-basis: 0;
    padding-right: 10px;
}

.pax-detail {
    padding-left: 5px;
    flex-grow: 2;
    flex-basis: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.depart-div {
    margin-top: 30px;
}

.pax-class {
    font-weight: bold;
}

#print-block {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 24px;
}

#print-block a {
    color: var(--theme-link);
}

#hotel-image {
    width: 100%;
    height: auto;
    flex-grow: 1;
    flex-basis: 0;
    padding-right: 20px;
}

.hotel-info {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
    padding-left: 20px;
}

#main-div {
    display: flex;
    flex-direction: row;
}

.rating-star {
    color: rgb(223, 167, 25);
}

.text-gray {
    color: gray;
    font-size: 1em;
}

.date-info {
    margin-top: 30px;
    display: flex;
}

.check-in,
.check-out,
.room-night {
    flex-grow: 1;
    flex-basis: 0;
}

.room-night {
    display: flex;
}

.room-night div {
    flex-grow: 1;
    flex-basis: 0;
}

.payment-content {
    margin-bottom: 5px;
}

.text-red {
    color: #d32f2f;
    font-weight: 500;
    font-family: "header1";
}

#total-price {
    color: var(--theme-dark-purple) !important;
    font-size: 2rem;
    font-weight: 600;
}

#container-total-price {
    color: gray;
}

.date-info h1 {
    font-size: 4rem !important;
}

#total-price {
    font-size: 3rem !important;
}

@font-face {
    font-family: "header";
    src: url("../../shared/assets/fonts/header.TTF") format("truetype");
}

@font-face {
    font-family: "body";
    src: url("../../shared/assets/fonts/body.TTF") format("truetype");
}

p,
span,
button,
h5,
input,
label {
    font-family: "body";
}

h1,
h2,
h3,
h4 {
    font-family: "header";
}

:root {
    --theme-purple: #a082af;
    --theme-dark-purple: #876897;
    --theme-text-dark-purple: rgb(103, 99, 168);
    --theme-text-dark-purple-hover: rgb(82, 79, 139);
    --theme-invalid: #e5b7d1;
    --theme-dark-border: #818181;
    --theme-light-border: #cccccc;
    --theme-input-border: rgb(229, 229, 229);
    --theme-text-light-grey: rgb(127, 127, 127);
    --theme-text-lighter: rgb(204, 198, 198);
    --theme-link: #00c2b1;
    --theme-link-hover: rgb(1, 163, 150);
    --theme-pink: #c95998;
    --theme-dark-pink: #a03d75;
    --theme-text-warning: #d32f2f;
}

.hotel-option-box {
    border: 2px solid var(--theme-pink);
    padding: 10px 20px;
    border-radius: 10px;
    margin: 20px 0px;
    position: relative;
}

.button-choose {
    border-radius: 2em;
    padding: 5px;
    color: white;
    border: none;
    background: darkgrey;
    transition: background 300ms;
}

.button-choose:hover {
    background: var(--theme-pink);
}

.chosen {
    background: var(--theme-dark-pink);
}

.btn-full {
    width: 100%;
    height: auto;
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.hotel-option-image {
    width: 175px;
    height: 175px;
    object-fit: cover;
    border-radius: 10px;
    margin-right: 20px;
    border: 1px solid grey;
}

.hotel-option-name {
    color: var(--theme-purple);
    font-size: 1.75rem;
}

.text-gray {
    color: gray;
    font-size: 1em;
}

.total-price {
    color: var(--theme-pink) !important;
    font-size: 1.5rem;
}

.hotel-option-star {
    font-size: 1rem;
}

.rating-star {
    color: rgb(223, 167, 25);
}

.hotel-option-rating {
    background: var(--theme-pink);
    color: white;
    padding: 10px;
    position: relative;
    right: 0;
    width: fit-content;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
}

.main-container {
    width: 80%;
    opacity: 0;
}

.head-img-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-head-left {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-row-gap: 5px;
}

.image-head-left img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    max-height: 300px;
    margin: 0 auto;
}

#slider {
    width: 100%;
    height: 150px;
    margin: 0;
}

.swiper-slide img {
    height: 150px;
    width: 100%;
    object-fit: cover;
}

.swiper-slide {
    text-align: center;
    height: 100%;
}

.image-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    background: rgb(0 0 0 / 90%);
    display: none;
    opacity: 0;
    transition: opacity 400ms;
    z-index: 40;
}

.image-box img {
    max-width: 90%;
    max-height: 90%;
    margin: auto;
    object-fit: contain;
}

.hotel-option-type {
    color: var(--theme-pink);
}

.amenity-title {
    color: var(--theme-dark-purple);
}

.amenity-subtitle {
    color: var(--theme-purple);
}

.hotel-info-ul {
    list-style: none;
    padding-left: 0px;
}

.hotel-info-ul li {
    padding: 5px 0;
}

#total-price {
    color: var(--theme-pink) !important;
    font-size: 1.5rem;
}

#container-total-price {
    color: gray;
}

#btn-search {
    background: var(--theme-purple);
    border-radius: 20em;
    width: 100%;
    border: none;
    margin-top: 5px;
    padding: 5px;
    color: white;
    font-size: 1.25rem;
    transition: background 300ms;
}

#btn-search:hover {
    background: var(--theme-dark-purple);
    text-decoration: none !important;
}

#booking-summary-img {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: cover;
}

.text-purple {
    color: var(--theme-text-dark-purple);
}

.text-purple select {
    background: none !important;
    border: none !important;
    margin-right: 10px;
}

#btn-book {
    background: #ed254e;
    border-radius: 20em;
    width: 100%;
    border: none;
    margin-top: 5px;
    padding: 5px;
    color: white;
    font-size: 1.25rem;
    transition: background 300ms;
}

#btn-book:hover {
    background: #c9193c;
}

.text-dark-purple {
    color: var(--theme-text-dark-purple);
}

.text-red {
    color: var(--theme-text-warning);
}

@media screen and (max-width: 768px) {
    .hotel-option-rating {
        position: relative;
        right: 0;
        width: fit-content;
    }

    .main-container {
        width: 100%;
    }

    .image-head-left img {
        height: auto;
        width: 100%;
        object-fit: cover;
    }

    #slider {
        height: 150px;
    }

    .swiper-slide img {
        height: 150px;
    }
}

@media screen and (max-width: 768px) {
    #main-div {
        display: block;
    }

    .hotel-info {
        padding: 0;
        margin: 0;
        margin-top: 30px;
        text-align: center;
        display: block;
    }

    .date-info {
        display: block;
    }
}

</style>
`