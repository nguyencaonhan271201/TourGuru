let colorThief = new ColorThief();
let userID;
let infoToSend = {};

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

  let accentColor = tinycolor(`rgb(${bgColor[0]},${bgColor[1]},${bgColor[2]})`);
  let accentComplimentColor = accentColor.complement().saturate(100);

  let mainColor = tinycolor("#6763A8");
  let compColor = mainColor.complement().saturate(100);

  if (accentColor.isDark()) {
    setColor($(".billboard h1, .billboard h6"), "color", accentColor.toRgb());
    setColor($(".circle"), "fill", accentComplimentColor.toRgb());
    setColor($(".window"), "border-color", accentComplimentColor.toRgb());

    setColor($(".TGI .main"), "fill", mainColor.toRgb());
    setColor($(".TGI .others"), "stroke", compColor.toRgb());
  } else {
    setColor(
      $(".billboard h1, .billboard h6"),
      "color",
      accentComplimentColor.toRgb()
    );
    setColor($(".circle"), "fill", accentColor.toRgb());
    setColor($(".window"), "border-color", accentColor.toRgb());

    setColor($(".TGI .main"), "fill", compColor.toRgb());
    setColor($(".TGI .others"), "stroke", mainColor.toRgb());
  }
  setColor($(".description"), "color", compColor.toRgb());
});

$(window).on("load", function () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      userID = user.uid;
      checkVisited(geoID);
      $(".visted_div").click(function () {
        sendVisited(geoID);
      });
    } else {
      location.replace("./../auth/login.php");
      return;
    }
  });
});

function setColor(obj, prop, color) {
  obj.css(prop, `rgb(${color.r},${color.g},${color.b})`);
}

function checkVisited(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      if (this.responseText == "0") {
        $("#visited_svg").load("visited~.svg");
        var tooltip = new bootstrap.Tooltip(
          document.getElementById("visited_svg"),
          {
            boundary: document.body,
          }
        );
      } else if (this.responseText == "1")
        $("#visited_svg").load("visited.svg");
    } else {
      console.log("");
    }
  };

  xhr.open(
    "GET",
    `../api/attraction/visited.php?userID=${userID}&geoID=${geoID}`
  );
  xhr.send();
}

function sendVisited(geoID) {
  $("#visited_svg").load("visited.svg");
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `../api/attraction/visiting.php`);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (this.status == 200) {
      console.log(this.responseText);
      checkVisited(geoID);
    }
  };
  xhr.send(
    `userID=${userID}&geoID=${geoID}&long=${infoToSend.longitude}&lat=${infoToSend.latitude}&region=${infoToSend.region}&title=${infoToSend.title}`
  );
}

function getDetailOfAttractions(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      //console.log(results);

      loadDetails(results);

      getPhotosOfLocation(geoID);

      getAttractionsOfGeo(geoID, {
        lng: parseFloat(results.longitude),
        lat: parseFloat(results.latitude),
      });
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

function getPhotosOfLocation(geoID) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      //console.log(results);
      loadGallery(
        results.data
          .filter((photo) => photo.images.original)
          .map((photo) => photo.images.original.url)
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
    "6015fab332mshe435514eb925d97p10417ejsn0296e3e75ef9"
  );

  xhr.send();
}

function getAttractionsOfGeo(geoID, center) {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (this.status == 200) {
      let results = JSON.parse(this.responseText);
      //console.log(results);
      if (results.errors) loadMap(center);
      else
        loadMap(
          center,
          results.data
            .filter((attraction) => attraction.name)
            .map((attraction) => ({
              position: {
                lng: parseFloat(attraction.longitude),
                lat: parseFloat(attraction.latitude),
              },
              name: attraction.name,
            }))
        );
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

function loadDetails(result) {
  $(".background img").attr("src", result.photo.images.original.url);
  $(".long").text(result.longitude);
  $(".lat").text(result.latitude);
  $(".region").text(result.timezone.split("/")[0]);
  $(".title").text(result.name);
  if (result.name.length >= 12) $(".title").fitText(0.9);
  $(".description").text(
    result.geo_description ? result.geo_description : result.description
  );

  //Store results for visiting request send
  infoToSend = {
    title: result.name,
    longitude: parseFloat(result.longitude),
    latitude: parseFloat(result.latitude),
    region: result.timezone.split("/")[0],
  };
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

function loadMap(center, attractions = []) {
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
    icon: {
      url: "../shared/assets/logo.svg",
      scaledSize: new google.maps.Size(50, 50), // scaled size
    },
  });
  attractions.forEach((attraction) => {
    if (
      !(
        attraction.position.lng == center.lng &&
        attraction.position.lat == center.lat
      )
    ) {
      let marker = new google.maps.Marker({
        position: attraction.position,
        title: attraction.name,
        map: map,
      });
    }
  });
}

let zone;
const geoID = new URL(window.location.href).searchParams.get("id");
//console.log(geoID);

//console.log(temp, tempAttractions, tempPhotos);

// loadDetails(temp);
// loadGallery(
//   tempPhotos.data
//     .filter((photo) => photo.images.original)
//     .map((photo) => photo.images.original.url)
// );
// loadMap(
//   { lng: parseFloat(temp.longitude), lat: parseFloat(temp.latitude) },
//   tempAttractions.data
//     .filter((attraction) => attraction.name)
//     .map((attraction) => ({
//       position: {
//         lng: parseFloat(attraction.longitude),
//         lat: parseFloat(attraction.latitude),
//       },
//       name: attraction.name,
//     }))
// );

//getDetailOfAttractions(geoID);
window.addEventListener("DOMContentLoaded", () => {
  getDetailOfAttractions(geoID);
});
