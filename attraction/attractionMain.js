$(".attraction_search")
  .selectize({
    valueField: "location_id",
    labelField: "name",
    searchField: "name",
    create: false,
    render: {
      option: function (item, escape) {
        return `<div class="search_result">
        <div class="d-flex align-items-center m-3">
          <img src="${item.photo.images.thumbnail.url}" class="me-3">
          <h2>${item.name}</h2>
        </div>
      </div>`;
      },
    },
    load: function (query, callback) {
      if (!query.length) return callback();
      $.ajax({
        url: `https://travel-advisor.p.rapidapi.com/locations/search?query=${query}&limit=10&offset=0`,
        type: "GET",
        beforeSend: function (request) {
          request.setRequestHeader(
            "x-rapidapi-host",
            "travel-advisor.p.rapidapi.com"
          );
          request.setRequestHeader(
            "x-rapidapi-key",
            "10ab83fc29mshe06091597dcf6bap1ad11ajsn261f28be7f22"
          );
        },
        error: function () {
          callback();
        },
        success: function (res) {
          //console.log(res.data.map((opt) => opt.result_object));
          callback(res.data.map((opt) => opt.result_object));
        },
      });
    },
  })
  .on("change", function () {
    window.location.href = `attraction.php?id=${$(this).val()}`;
  });

//Hàm tìm kiếm từ query (tìm thành phố, quốc gia)
function getSearchInfo(searchQuery, limit = 10, offset = 0) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      //LoadCarousel(results.data);
      //console.log(results);
    } else {
      console.log("Not found");
    }
  };

  xhr.open(
    "GET",
    `https://travel-advisor.p.rapidapi.com/locations/search?query=${searchQuery}&limit=${limit}&offset=${offset}`
  );
  xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "10ab83fc29mshe06091597dcf6bap1ad11ajsn261f28be7f22"
  );

  xhr.send();
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Get top tourist attractions
function getTop20TouristAttractions() {
  let dataRetrieve = [];
  const long1 = -150;
  const lat1 = 40;
  const long2 = 30;
  const lat2 = 80;
  const offset = 0;

  let time = 0;
  let result = [];

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      dataRetrieve = dataRetrieve.concat(results.data);

      let resultArray = [];

      for (let i = 0; i < dataRetrieve.length; i++) {
        if (dataRetrieve[i]["ad_position"] == null) {
          if (typeof dataRetrieve[i] !== "undefined") {
            if ("photo" in dataRetrieve[i]) resultArray.push(dataRetrieve[i]);
          }
        }
      }

      /*let randomIndex = [];
      while (randomIndex.length != 20) {
        let random = Math.floor(Math.random() * (resultArray.length + 1));
        if (randomIndex.indexOf(random) == -1) {
          randomIndex.push(random);
          result.push(resultArray[random]);
        }
      }*/

      let result = resultArray
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 20);

      //console.log(result);

      loadCarousel(
        result.map((result) => ({
          imgURL: result.photo.images.original.url,
          city: result.address_obj.city,
          country: result.address_obj.country,
        }))
      );
      loadTopLocationsCards(
        result.map((result) => ({
          locaId: result.location_id,
          imgURL: result.photo.images.original.url,
          city: result.address_obj.city,
          country: result.address_obj.country,
        }))
      );
      return result;
    } else {
      return null;
    }
  };

  xhr.open(
    "GET",
    `https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary?tr_longitude=${long1}&tr_latitude=${long2}&bl_longitude=${lat1}&bl_latitude=${lat2}&offset=${offset}&min_rating=3&currency=USD&limit=30&lunit=km&lang=en_US&subcategory=47`
  );

  xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9"
  );

  xhr.send();
}

function loadCarousel(results) {
  //console.log(results);
  let carousel = $(".carousel-inner");
  let active = false;

  results.forEach((result) => {
    carousel.append(`<div class="carousel-item${active++ ? "" : " active"}">
      <img
        src="${result.imgURL}"
        class="d-block"
      />
      <a class="carousel-anchor" href="../attraction/attraction.php?id=${
        result.locaId
      }">
      ${result.city ? result.city + ", " + result.country : result.country}
      </a>
    </div>`);
  });
}

function loadTopLocationsCards(results) {
  let top_location_cards_div = $(".top_location_cards");
  let colorThief = new ColorThief();

  results.forEach((result) => {
    top_location_cards_div.append(`
    <div class="top_location card bordered_1 me-5" data-geoid="${
      result.locaId
    }">
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
            <h1 class="card-title">${
              result.city ? result.city + ", " + result.country : result.country
            }</h1>
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

//getSearchInfo("France");
//getTop20TouristAttractions();

loadCarousel(
  temp.map((result) => ({
    locaId: result.location_id,
    imgURL: result.photo.images.original.url,
    city: result.address_obj.city,
    country: result.address_obj.country,
  }))
);
loadTopLocationsCards(
  temp.map((result) => ({
    locaId: result.location_id,
    imgURL: result.photo.images.original.url,
    city: result.address_obj.city,
    country: result.address_obj.country,
  }))
);
