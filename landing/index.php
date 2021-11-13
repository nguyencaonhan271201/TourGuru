<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tour Guru</title>
    <link href="../shared/css/style.css" rel="stylesheet" />
    <link href="style.css" rel="stylesheet" />
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
    <!-- <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-kQtW33rZJAHjgefvhyyzcGF3C5TFyBQBA13V1RKPf4uH+bwyzQxZ6CmMZHmNBEfJ"
      crossorigin="anonymous"
    ></script> -->
  </head>
  <body>
    <?php 
      include "../shared/php/header.php";
    ?>
    <div class="billboard position-relative">
      <div
        id="carouselExampleSlidesOnly"
        class="carousel slide position-absolute"
        data-bs-ride="carousel"
      >
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              src="https://www.citieschangingdiabetes.com/network/seoul/_jcr_content/root/imagevideotext_copy.coreimg.jpeg/1605286730135/adobestock-306923135.jpeg"
              class="d-block"
              alt="..."
            />
          </div>
          <div class="carousel-item">
            <img
              src="https://res.klook.com/image/upload/v1626235525/blog/matc1mbuxstodneephfr.jpg"
              class="d-block"
              alt="..."
            />
          </div>
        </div>
      </div>

      <div class="position-absolute top-50 start-50 translate-middle w-100">
        <h1 class="text-center">Where to ?</h1>
        <div class="input-group w-100 justify-content-center">
          <span class="input-group-append">
            <button class="btn rounded-pill-left border-right-0" type="button">
              <i class="fa fa-search"></i>
            </button>
          </span>
          <input class="rounded-pill-right border-0 w-75" type="text" />
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <h1 class="mt-4 mb-4">top locations</h1>

      <div
        class="
          top_location_cards
          d-flex
          flex-row flex-nowrap
          overflow-auto
          mb-3
        "
      >
        <div class="top_location card bordered_1 me-3">
          <div class="row g-0">
            <div class="col-5">
              <img
                src="https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTYyNDg1MjE3MTI1Mjc5Mzk4/topic-london-gettyimages-760251843-promo.jpg"
                class="bordered_2"
                alt="..."
              />
            </div>
            <div class="col-7 position-relative">
              <div
                class="card-body position-absolute top-50 translate-middle-y"
              >
                <h1 class="card-title">London</h1>
              </div>
            </div>
          </div>
        </div>

        <div class="top_location card bordered_1 me-3 p-3">
          <div class="row g-0">
            <div class="col-5">
              <img
                src="https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTYyNDg1MjE3MTI1Mjc5Mzk4/topic-london-gettyimages-760251843-promo.jpg"
                class="bordered_2"
                alt="..."
              />
            </div>
            <div class="col-7 position-relative">
              <div
                class="card-body position-absolute top-50 translate-middle-y"
              >
                <h1 class="card-title">London</h1>
              </div>
            </div>
          </div>
        </div>

        <div class="top_location card bordered_1 me-3 p-3">
          <div class="row g-0">
            <div class="col-5">
              <img
                src="https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTYyNDg1MjE3MTI1Mjc5Mzk4/topic-london-gettyimages-760251843-promo.jpg"
                class="bordered_2"
                alt="..."
              />
            </div>
            <div class="col-7 position-relative">
              <div
                class="card-body position-absolute top-50 translate-middle-y"
              >
                <h1 class="card-title">London</h1>
              </div>
            </div>
          </div>
        </div>

        <div class="top_location card bordered_1 me-3 p-3">
          <div class="row g-0">
            <div class="col-5">
              <img
                src="https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTYyNDg1MjE3MTI1Mjc5Mzk4/topic-london-gettyimages-760251843-promo.jpg"
                class="bordered_2"
                alt="..."
              />
            </div>
            <div class="col-7 position-relative">
              <div
                class="card-body position-absolute top-50 translate-middle-y"
              >
                <h1 class="card-title">London</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <h1 class="mt-4 mb-4">flights</h1>
      <div id="carouselFlight" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/1.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/9.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/2.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/8.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/3.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/10.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/4.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/7.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/5.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/flights/6.jpg" alt="">
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselFlight" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselFlight" role="button" data-slide="next">
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
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/1.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/8.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/7.jpeg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/3.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/5.png" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/2.webp" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/6.jpg" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/4.webp" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/9.png" alt="">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100" src="../shared/assets/images/carousel/hotels/10.jpg" alt="">
            </div>
        </div>
        <a class="carousel-control-prev" href="#carouselHotel" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselHotel" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>

    </div>


    <div class="mt-5">
      <h1 class="text-center">why tour guru ?</h1>

      <div class="container">
        <div class="row p-5">
          <div class="col-md-4 d-flex justify-content-center">
            <img
              class="img-fluid"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407528373-a0e2c450b5cfac244d687d6fa8f5dd98.png?tr=dpr-2,h-150,q-75,w-150"
            />
          </div>
          <div class="col-md-8  d-flex align-items-center">
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
          <div class="col-md-4 d-flex justify-content-center">
            <img
              class="img-fluid"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2017/05/10/1494407536280-ddcb70cab4907fa78468540ba722d25b.png?tr=dpr-2,h-150,q-75,w-150"
            />
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

    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

  </body>
</html>
