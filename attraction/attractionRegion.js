function getDetailOfRegion(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);

      if (results.category.key != "geographic")
        window.location.href = `attraction.php?id=${geoID}`;

      console.log(results);

      $("#region").text(results.name);

      getPhotosOfLocation(geoID);

      getAttractionsOfGeo(geoID);
    } else {
      console.log("Not found");
    }
  };

  xhr.open(
    "GET",
    `https://travel-advisor.p.rapidapi.com/attractions/get-details?location_id=${geoID}`
  );

  xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6"
  );

  xhr.send();
}

function getPhotosOfLocation(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      console.log(results);
      loadCarousel(
        results.data
          .filter((photo) => photo.images.original)
          .map((photo) => ({
            imgURL: photo.images.original.url,
          }))
      );
    } else {
      return null;
    }
  };

  xhr.open(
    "GET",
    `https://travel-advisor.p.rapidapi.com/photos/list?location_id=${geoID}`
  );

  xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6"
  );

  xhr.send();
}

function loadCarousel(results) {
  console.log(results);
  let carousel = $(".carousel-inner");
  let active = false;

  results.forEach((result) => {
    carousel.append(`<div class="carousel-item${active++ ? "" : " active"}">
      <img
        src="${result.imgURL}"
        class="d-block"
      />
    </div>`);
  });
}

function getAttractionsOfGeo(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      loadTopAttractionCards(
        results.data
          .filter((result) => result.name)
          .map((result) => ({
            locaId: result.location_id,
            imgURL: result.photo.images.original.url,
            name: result.name,
          }))
      );
    }
  };

  xhr.open(
    "GET",
    `https://travel-advisor.p.rapidapi.com/attractions/list?location_id=${geoID}&geo_type=narrow`
  );

  xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "50ab243ea0mshdda18fe8e21df40p101ca6jsnac533b141bb6"
  );

  xhr.send();
}

function loadTopAttractionCards(results) {
  console.log(results);
  let top_location_cards_div = $(".top_location_cards");
  let colorThief = new ColorThief();

  results.forEach((result) => {
    top_location_cards_div.append(`
    <div class="top_location card bordered_1 me-5" data-geoid="${result.locaId}">
      <div class="row g-0">
        <div class="col-5">
          <img
            src="${result.imgURL}"
            class="bordered_2"
            crossorigin="anonymous" 
          />
        </div>
        <div class="col-7 position-relative">
          <div
            class="card-body position-absolute top-50 translate-middle-y"
          >
            <h1 class="card-title">${result.name}</h1>
          </div>
        </div>
      </div>
    </div>`);

    $(`div[data-geoid="${result.locaId}"] img`).on("load", function () {
      let pallete = colorThief.getPalette(this, 2);
      $(`div[data-geoid="${result.locaId}"]`).css(
        "background-color",
        `rgb(${pallete[0][0]},${pallete[0][1]},${pallete[0][2]})`
      );
      $(`div[data-geoid="${result.locaId}"] .card-title`).css(
        "color",
        `rgb(${pallete[1][0]},${pallete[1][1]},${pallete[1][2]})`
      );
    });
  });

  $(".top_location.card").click(function () {
    window.location.href = `../attraction/attraction.php?id=${
      $(this).data().geoid
    }`;
  });
}

let zone;
const geoID = new URL(window.location.href).searchParams.get("id");
window.addEventListener("DOMContentLoaded", () => {
  getDetailOfRegion(geoID);
});
