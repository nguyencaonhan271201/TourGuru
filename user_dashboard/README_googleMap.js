//html
<div id="map" class="w-100 h-100"></div>;

//hàm load map
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

loadMap(
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

// giải thích: object center là để center cái bản đồ, cần 2 biến Float {lng, lat}
// các vị trí còn lại thì là 1 object dạng {position: {lng, lat}, name}
