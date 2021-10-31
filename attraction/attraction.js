let colorThief = new ColorThief();

$(window).scroll(function () {
  /*fades background gradually*/
  let opacity = $(this).scrollTop() / $("html").height() + 0.4;
  $(".overlay").css("background", `rgba(50,53,69,${opacity})`);

  /*fadein objects*/
  let windowBottom = $(this).scrollTop() + $(this).innerHeight();
  $(".fadein").each(function () {
    /* Check the location of each desired element */
    var objectBottom = $(this).offset().top + $(this).outerHeight();
    //console.log(objectBottom, windowBottom);
    if (objectBottom < windowBottom) {
      //object comes into view (scrolling down)
      if ($(this).css("opacity") == 0) {
        $(this).fadeTo(800, 1);
      }
    }
  });
});

$(".background img").on("load", function () {
  let bgColor = colorThief.getColor(this);

  let mainColor = tinycolor("#6763A8");
  let compColor = mainColor.complement().saturate(100);

  if (tinycolor(`rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`).isLight()) {
    setColor($(".billboard h1"), "color", mainColor.toRgb());
    setColor($(".TGI .main"), "fill", mainColor.toRgb());
    setColor($(".billboard h6"), "color", compColor.toRgb());
    setColor($(".window"), "border-color", compColor.toRgb());
    setColor($(".circle, .inner"), "fill", compColor.desaturate(20).toRgb());
    setColor($(".TGI .others"), "stroke", compColor.toRgb());
    setColor($(".description"), "color", compColor.toRgb());
  }
});

function setColor(obj, prop, color) {
  obj.css(prop, `rgb(${color.r},${color.g},${color.b})`);
}

function getDetailOfAttractions(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.responseText);
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
    "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9"
  );

  xhr.send();
}

function getAttractionsOfGeo(geoID, name) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      console.log(results);
    } else {
      console.log("Not found");
    }
  };

  xhr.open(
    "GET",
    `https://travel-advisor.p.rapidapi.com/attractions/list?location_id=${geoID}&geo_type=narrow`
  );

  xhr.setRequestHeader("x-rapidapi-host", "travel-advisor.p.rapidapi.com");
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9"
  );

  xhr.send();
}

function getPhotosOfLocation(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      console.log(results);
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
    "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9"
  );

  xhr.send();
}

function loadDetails(result) {
  $(".background img").attr("src", result.photo.images.original.url);
  $(".long").text(result.longitude);
  $(".lat").text(result.latitude);
  $(".region").text(result.parent_display_name);
  $(".title").text(result.name);
  $(".description").text(result.geo_description);
}

function loadGallery(imgURLs) {
  let i = 0;
  imgURLs.forEach((url) => {
    $.get("circle.html", function (svg) {
      svg = svg.replaceAll("!!INCREASE!!", (i++).toString());
      svg = svg.replace("!!REPLACE!!", url);
      svg = `<div class="gallery_img m-5">${svg}</div>`;
      let temp = $(".gallery").append(svg);
    });
  });
}

// Initialize and add the map
function initMap(center, attractions) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: center,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });
  const centerMarker = new google.maps.Marker({
    position: center,
    map: map,
    icon: "../shared/assets/logo.svg",
  });
  attractions.forEach((attraction) => {
    let marker = new google.maps.Marker({
      position: attraction.position,
      title: attraction.name,
      map: map,
    });
  });
}

console.log(temp, tempAttractions, tempPhotos);
loadDetails(temp);
loadGallery(
  tempPhotos.data
    .filter((photo) => photo.images.original)
    .map((photo) => photo.images.original.url)
);
initMap(
  { lng: parseFloat(temp.longitude), lat: parseFloat(temp.latitude) },
  tempAttractions.data
    .filter((attraction) => attraction.name)
    .map((attraction) => ({
      position: {
        lng: parseFloat(attraction.longitude),
        lat: parseFloat(attraction.latitude),
      },
      name: attraction.name,
    }))
);
