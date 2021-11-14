<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link href="../shared/css/style.css" rel="stylesheet" />
    <link href="landing.css" rel="stylesheet" />
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
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-kQtW33rZJAHjgefvhyyzcGF3C5TFyBQBA13V1RKPf4uH+bwyzQxZ6CmMZHmNBEfJ"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js"
      integrity="sha512-n/4gHW3atM3QqRcbCn6ewmpxcLAHGaDjpEBu4xZd47N0W2oQ+6q7oc3PXstrJYXcbNU1OHdQ1T7pAP+gi5Yu8g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
  </head>
  <body>
  
    <?php 
      include "shared/php/header.php";
    ?>

    <div class="billboard position-relative">
      <div
        id="carouselAttraction"
        class="carousel slide position-absolute"
        data-bs-ride="carousel"
        data-interval="500"
      >
        <div class="carousel-inner"></div>
      </div>
    </div>

    <div class="container-fluid">
      <h1 class="mt-4 mb-4">top locations</h1>

      <div
        class="
          top_location_cards
          horscroll
          d-flex
          flex-row flex-nowrap
          overflow-auto
          mb-3
          p-2
        "
      ></div>
    </div>

    <div class="container-fluid">
      <h1 class="mt-4 mb-4">flights</h1>
      <div id="carouselFlight" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/1.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/9.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/2.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/8.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/3.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/10.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/4.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/7.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/5.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/flights/6.jpg"
              alt=""
            />
          </div>
        </div>
        <a
          class="carousel-control-prev"
          href="#carouselFlight"
          role="button"
          data-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a
          class="carousel-control-next"
          href="#carouselFlight"
          role="button"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>

    <div class="container-fluid">
      <h1 class="mt-4 mb-4">hotels</h1>
      <div id="carouselHotel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/1.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/8.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/7.jpeg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/3.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/5.png"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/2.webp"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/6.jpg"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/4.webp"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/9.png"
              alt=""
            />
          </div>
          <div class="carousel-item">
            <img
              class="d-block w-100"
              src="../shared/assets/images/carousel/hotels/10.jpg"
              alt=""
            />
          </div>
        </div>
        <a
          class="carousel-control-prev"
          href="#carouselHotel"
          role="button"
          data-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a
          class="carousel-control-next"
          href="#carouselHotel"
          role="button"
          data-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>

    <div class="mt-5">
      <h1 class="text-center">why tour guru ?</h1>

      <div class="container">
        <div class="row p-5">
          <div class="col-md-4 d-flex justify-content-center" id="l1_svg">
            <script>
              $("#l1_svg").load("l1.svg");
            </script>
          </div>
          <div class="col-md-8 d-flex align-items-center">
            <div>
              <h2>Cheap</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Obcaecati adipisci, repudiandae quisquam officia provident earum
                ab omnis iusto beatae modi dolor velit perspiciatis
                necessitatibus nihil ullam vero. Reiciendis, quos eveniet.
              </p>
            </div>
          </div>
        </div>

        <div class="row flex-md-row-reverse p-5">
          <div class="col-md-4 d-flex justify-content-center" id="l2_svg">
            <script>
              $("#l2_svg").load("l2.svg");
            </script>
          </div>
          <div class="col-md-8 d-flex align-items-center">
            <div>
              <h2>Cheap</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Obcaecati adipisci, repudiandae quisquam officia provident earum
                ab omnis iusto beatae modi dolor velit perspiciatis
                necessitatibus nihil ullam vero. Reiciendis, quos eveniet.
              </p>
            </div>
          </div>
        </div>

        <div class="row p-5">
          <div class="col-md-4 d-flex justify-content-center" id="l3_svg">
            <script>
              $("#l3_svg").load("l3.svg");
            </script>
          </div>
          <div class="col-md-8 d-flex align-items-center">
            <div>
              <h2>Cheap</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Obcaecati adipisci, repudiandae quisquam officia provident earum
                ab omnis iusto beatae modi dolor velit perspiciatis
                necessitatibus nihil ullam vero. Reiciendis, quos eveniet.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <?php 
      include "shared/php/footer.php";
    ?>

  </body>
  <script
  src="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/js/standalone/selectize.min.js"
  integrity="sha512-pF+DNRwavWMukUv/LyzDyDMn8U2uvqYQdJN0Zvilr6DDo/56xPDZdDoyPDYZRSL4aOKO/FGKXTpzDyQJ8je8Qw=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.2/color-thief.min.js"
    integrity="sha512-mMe7BAZPOkGbq+zhRBMNV3Q+5ZDzcUEOJoUYXbHpEcODkDBYbttaW7P108jX66AQgwgsAjvlP4Ayb/XLJZfmsg=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  ></script>
  <script type="text/javascript" src="temp.js" charset="utf-8"></script>
  <script type="text/javascript" src="landing.js" charset="utf-8"></script>
</html>