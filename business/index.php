<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tour Guru | Business</title>
    <link href="../shared/css/style.css" rel="stylesheet" />
    <link href="../landing/style.css" rel="stylesheet" />
    <link href="business_dashboard.css" rel="stylesheet" />    
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-uWxY/CJNBR+1zjPWmfnSnVxwRheevXITnMqoEIeG1LJrdI0GlVs/9cVSyPYXdcSF"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/css/selectize.bootstrap4.min.css" integrity="sha512-MMojOrCQrqLg4Iarid2YMYyZ7pzjPeXKRvhW9nZqLo6kPBBTuvNET9DBVWptAo/Q20Fy11EIHM5ig4WlIrJfQw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-kQtW33rZJAHjgefvhyyzcGF3C5TFyBQBA13V1RKPf4uH+bwyzQxZ6CmMZHmNBEfJ"
      crossorigin="anonymous"
    ></script> -->
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js"
      integrity="sha512-n/4gHW3atM3QqRcbCn6ewmpxcLAHGaDjpEBu4xZd47N0W2oQ+6q7oc3PXstrJYXcbNU1OHdQ1T7pAP+gi5Yu8g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <link href="context-menu.css" rel="stylesheet" />
  </head>
  <body>
  
    <?php 
      include "../shared/php/header.php";
    ?>


<div class="container-fluid" style="padding-top: 80px;">
      <div class="context-menu-container" id="context-menu-items">
        <ul>
          <li data-choice="view">View</li>
          <li  data-choice="delete">Delete</li>
        </ul>
      </div>
  
      <div class="container-fluid summary">
        <div class="row">
          <div class="col-md-4 col-sm p-3 position-relative">
            <img src="graph_1.svg" class="position-absolute top-0 end-0 mt-2 ps-4">
            <div class="h-100 d-flex flex-column justify-content-between pt-4">
              <h5 class="text-sm-center text-md-start">New bookings</h5>
              <h1 class="text-sm-center text-md-start" id="new-bookings"></h1>
            </div>
          </div>
          <div class="col-md-4 col-sm p-3 position-relative">
            <img src="graph_2.svg" class="position-absolute top-0 end-0 mt-2 ps-4">
            <div class="h-100 d-flex flex-column justify-content-between pt-4">
              <h5 class="text-sm-center text-md-start">Total bookings</h5>
              <h1 class="text-sm-center text-md-start" id="total-bookings"></h1>
            </div>
          </div>
          <div class="col-md-4 col-sm p-3 position-relative">
            <img src="graph_3.svg" class="position-absolute top-0 end-0 mt-2 ps-4">
            <div class="h-100 d-flex flex-column justify-content-between pt-4">
              <h5 class="text-sm-center text-md-start">
                Revenue
              </h5>
              <h1 class="text-sm-center text-md-start" id="revenue"></h1>
            </div>
          </div>
        </div>
      </div>
  
      <div class="container-fluid p-3">
        <div class="row">
          <div class="col mb-3">
            <div class="row">
              <div class="col-md-5 d-flex justify-content-sm-center justify-content-md-start align-items-center">
                <div
                  class="btn-group booking_trends_chart_options"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio1"
                    autocomplete="off"
                    data-period="Y"
                  />
                  <label id="labelradio1" class="btn btn-outline-primary" for="btnradio1"
                    >Year</label
                  >
    
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio2"
                    autocomplete="off"
                    data-period="Q"
                  />
                  <label class="btn btn-outline-primary" for="btnradio2"
                    >Quarter</label
                  >
    
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio3"
                    autocomplete="off"
                    data-period="M"
                  />
                  <label class="btn btn-outline-primary" for="btnradio3"
                    >Month</label
                  >
    
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio4"
                    autocomplete="off"
                    data-period="W"
                    checked
                  />
                  <label class="btn btn-outline-primary" for="btnradio4"
                    >Week</label
                  >
                </div>
              </div>
              <div class="col-md-7">
                <h1 class="outline-1 text-sm-center text-xs-start">booking trends</h1>
              </div>
            </div>
            <div class="d-flex justify-content-between">             
              
            </div>
  
            <div>
              <canvas id="myChart" />
            </div>
          </div>
        </div>
      </div>
  
      <div class="w-100 p-3">
        <hr>
        <h1 class="outline-1 ps-1 text-xs-center text-md-start">bookings</h1>
        <div class="table-responsive">
          <table class="business_table table table-borderless table-hover">
            <thead>
              <tr>
                <th scope="col">Booking ID</th>
                <th scope="col">Date</th>
                <th scope="col">Iteration summary</th>
                <th scope="col">No. of pax</th>
                <th scope="col">Status</th>
                <th scope="col">View</th>
                <th></th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>        
      </div>
    </div>

    <?php 
      include "../shared/php/footer.php";
    ?>

  </body>

  
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.0/chart.min.js"
    integrity="sha512-GMGzUEevhWh8Tc/njS0bDpwgxdCJLQBWG3Z2Ct+JGOpVnEmjvNx6ts4v6A2XJf1HOrtOsfhv3hBKpK9kE5z8AQ=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  ></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/FitText.js/1.2.0/jquery.fittext.js" integrity="sha512-y1yfXWvbXggos1g8bZhtprle9WdjkQtWrklZQkTpsgQxg+b5gdeljJ+I6iskDq3w55rnd1x6a6W+xHwAZuz1oQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.2/color-thief.min.js"
    integrity="sha512-mMe7BAZPOkGbq+zhRBMNV3Q+5ZDzcUEOJoUYXbHpEcODkDBYbttaW7P108jX66AQgwgsAjvlP4Ayb/XLJZfmsg=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  ></script>
  
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/tinycolor/1.4.2/tinycolor.min.js"
    integrity="sha512-+aXA9mgbUvFe0ToTlbt8/3vT7+nOgUmFw29wfFCsGoh8AZMRSU0p4WtOvC1vkF2JBrndPN2TuNZsHPAKPPxe8Q=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  ></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  
  <script type="text/javascript" src="../landing/temp.js" charset="utf-8"></script>
  <script type="text/javascript" src="../landing/landing.js" charset="utf-8"></script> 

  
</html>

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js"></script>

  <script src="./../shared/js/firebase.js"></script>  

  <script src="temp.js"></script>
  <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script
  type="text/javascript"
  src="business_dashboard.js"
  charset="utf-8"
  ></script>
  <script src="context-menu.js"></script>