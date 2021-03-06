<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tour Guru | Attraction</title>
    <link href="../shared/css/style.css" rel="stylesheet" />
    <link href="attraction.css" rel="stylesheet" />
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
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js"
      integrity="sha512-n/4gHW3atM3QqRcbCn6ewmpxcLAHGaDjpEBu4xZd47N0W2oQ+6q7oc3PXstrJYXcbNU1OHdQ1T7pAP+gi5Yu8g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    ></script>
    <!-- <script type="text/javascript" src="../shared/js/main.js" charset="utf-8"></script> -->
    <nav></nav>
  </head>
  <body>

    <?php 
      include "../shared/php/header.php";
    ?>

    <div class="billboard scrollsnap vw-100 vh-100 position-relative">
      <div class="background position-fixed w-100 h-100">
        <div class="position-relative w-100 h-100">
          <img class="position-absolute w-100 h-100" crossorigin="anonymous" />
          <div class="overlay position-absolute w-100 h-100"></div>
        </div>
      </div>

      <div
        class="position-absolute top-50 start-50 translate-middle w-100 h-100"
      >
        <div class="window position-absolute top-50 start-50 translate-middle">
          <div class="position-absolute bottom-0 ms-2">
            <h6 class="long"></h6>
            <h6 class="lat"></h6>
          </div>

          <div class="position-absolute bottom-0 end-0 me-4">
            <h6 class="region"></h6>
          </div>
        </div>

        <div
          class="position-absolute top-50 start-50 translate-middle"
          id="circle_2_svg"
        >
          <script>
            $("#circle_2_svg").load("circle_2.svg");
          </script>
        </div>

        <div
          class="position-absolute top-50 start-50 translate-middle w-75 h-75"
        >
          <div class="TGI_div position-absolute" id="TGI_svg">
            <script>
              $("#TGI_svg").load("TGI.svg");
            </script>
          </div>

          <h1
            class="
              title
              text-center
              position-absolute
              top-50
              start-50
              translate-middle
            "
          ></h1>

          <div class="visted_div position-absolute bottom-0 end-0">
            <div class="position-absolute" id="visited_svg">
              <script>
                $("#visited_svg").load("visited~.svg");
              </script>
            </div>

            <div
              class="position-absolute top-50 start-50 translate-middle"
              id="logo_svg"
            >
              <script>
                $("#logo_svg").load("../shared/assets/logo.svg");
              </script>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="additional scrollsnap vw-100 vh-100 position-relative">
      <p
        class="
          description
          fadein
          text-justify
          position-absolute
          top-50
          translate-middle-y
          m-4
        "
      ></p>
    </div>

    <div
      class="
        gallery
        horscroll
        scrollsnap
        vh-100
        d-flex
        flex-row flex-nowrap
        align-items-center
        overflow-auto
      "
    ></div>

    <div class="map scrollsnap vw-100 vh-100">
      <div id="map" class="w-100 h-100"></div>
    </div>

  </body>
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
  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-auth-compat.js"></script>
  <script src="./../shared/js/firebase.js"></script>
  
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

  <script type="text/javascript" src="temp.js" charset="utf-8"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDejsjipkOQWWhjeMzWc0otSPqcNTNkqZs&libraries=&v=weekly&channel=2"></script>
  <script type="text/javascript" src="attraction.js" charset="utf-8"></script>
</html>

