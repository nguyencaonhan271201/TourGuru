let css = `
<style>
    #remaining-time {
        color: var(--theme-text-dark-purple);
    }
    
    .danger {
        color: #ed254e !important;
    }
    
    .text-purple {
        color: var(--theme-text-dark-purple);
    }
    
    .text-purple select {
        background: none !important;
        border: none !important;
        margin-right: 10px;
    }
    
    .text-pink {
        color: var(--theme-pink);
    }
    
    .pax-input label {
        color: var(--theme-text-dark-purple);
    }
    
    .pax-input select {
        background: none !important;
        margin-right: 10px;
        padding: 5px;
        border: 1px solid var(--theme-purple);
        border-radius: 50px;
    }
    
    .input-div {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    
    .input-div input {
        background: none !important;
        margin-right: 10px;
        padding: 5px 15px;
        border: 1px solid var(--theme-purple);
        border-radius: 50px;
        width: 100%;
        text-transform: uppercase;
    }
    
    input[type="date"] {
        background: none !important;
        margin-right: 10px;
        padding: 5px 15px;
        border: 1px solid var(--theme-purple);
        border-radius: 50px;
    }
    
    .pax-input {
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    }
    
    #btn-check {
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
    
    #btn-check:hover {
        background: var(--theme-dark-purple);
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
        display: none;
    }
    
    #btn-book:hover {
        background: #c9193c;
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
    }
    
    .depart-div {
        margin-top: 30px;
    }
    
    .pax-class {
        font-weight: bold;
    }

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
        font-family: "body";
    }
    
    h1,
    h2,
    h3 {
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
    }
    
    #horizontal-upper-form-div select {
        background: none !important;
        border: none !important;
        margin-right: 10px;
    }
    
    #main-search-form {
        background: var(--theme-purple);
        margin-top: 10px;
        width: 100%;
        height: 50px;
        border-radius: 5px;
    }
    
    #main-search-form .d-flex,
    #main-search-form .d-flex .input-block {
        height: 100%;
    }
    
    #main-search-form .d-flex .input-block,
    #main-search-form .d-flex .input-block-m {
        background: white;
        margin-right: 5px;
        border-radius: 5px;
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
    
    #btn-search {
        height: 100%;
        width: 100%;
        background: none;
        border: none;
        color: white;
    }
    
    .btn-search-block {
        background: var(--theme-link) !important;
        border-radius: 5px;
        margin-right: 0px !important;
        transition: background 300ms;
    }
    
    .btn-search-block:hover {
        background: var(--theme-link-hover) !important;
    }
    
    .col-md-5.col-sm-12.d-flex.pr-0 {
        height: 100%;
    }
    
    .search-div {
        height: 90vh;
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
    
    .flight-order {
        padding: 3px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background: var(--theme-purple);
        text-align: center;
        color: white;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .summary-airport-code {
        background: rgb(223, 223, 223);
        color: rgb(114, 114, 114);
        padding: 5px;
        border-radius: 20em;
        width: 50px;
    }
    
    .your-flight {
        color: var(--theme-dark-purple);
    }
    
    .div-purple {
        color: var(--theme-text-dark-purple);
    }
    
    #total-price {
        color: var(--theme-pink) !important;
        font-size: 1.5rem;
    }
    
    #container-total-price {
        color: gray;
    }
    
    #return-date-h2,
    #depart-date-h2 {
        color: var(--theme-text-dark-purple);
        margin-bottom: 40px;
    }
    
    .text-gray {
        color: gray;
        font-size: 0.8em;
    }
    
    .total-price {
        color: var(--theme-pink) !important;
        font-size: 1.3rem;
    }
    
    .button-choose {
        border-radius: 5px;
        padding: 5px;
        color: white;
        border: none;
        background: darkgrey;
        transition: background 300ms;
    }
    
    .button-choose:hover {
        background: var(--theme-purple);
    }
    
    .chosen {
        background: var(--theme-dark-purple);
    }
    
    .btn-full {
        width: 100%;
    }
    
    .flight-option-box {
        border: 2px solid var(--theme-dark-purple);
        padding: 10px 20px;
        border-radius: 10px;
        margin: 20px 0px;
    }
    
    #flight-search-form {
        width: 100%;
    }
    
    #btn-confirm {
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
    
    #btn-confirm:hover {
        background: var(--theme-dark-purple);
    }

    .m-0 {
      margin: 0px;
    }

    .d-flex {
      display: flex;
    }

    .justify-content-between {
      justify-content: between;
    }

    .mr-2 {
      margin-right: 10px;
    }
  
    .mt-1 {
      margin-top: 5px;
    }
    
    .mb-1 {
      margin-bottom: 10px;
    }

    .mt-0 {
      margin-top: 0px;
    }
    
    .mb-0 {
      margin-bottom: 0px;
    }
    
    .flex-column {
      flex-direction: column;
    }
    
    .align-items-center {
      align-items: center;
    }
  </style>`