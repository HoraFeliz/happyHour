"use strict";

function initMap() {

  const latLoc = parseFloat(document.getElementById("placeData1").value)
  const lngLoc = parseFloat(document.getElementById("placeData0").value)
  const placeName = document.getElementById('place-detail-name').innerHTML
  const placeAddress = document.getElementById('place-detail-address-text').innerHTML


  // const location = document.getElementById("placeData").getAttribute('value')
  // console.log(JSON.stringify(location));

  const myLatLng = {
    lat: latLoc,
    lng: lngLoc
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: myLatLng
  });
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h5 id="firstHeading" class="firstHeading">${placeName}</h5>` +
    '<div id="bodyContent">' +
    `<p>${placeAddress}` +
    "</div>" +
    "</div>";
  const infoWindow = new google.maps.InfoWindow({
    content: contentString
  });
  const marker = new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Hello World!"
  });
  // marker.addListener("click", () => {
  //   infoWindow.open(map, marker);
  // });

  document.addEventListener("DOMContentLoaded", () => {
    infoWindow.open(map, marker);
  });


}



// "use strict";

// function initMap() {
//   const map = new google.maps.Map(document.getElementById("map"), {
//     center: {
//       lat: 40.416511,
//       lng: -3.705247,
//     },
//     zoom: 13,
//   });

//   const options = {
//     types: ["establishment"],
//   };
//   const card = document.getElementById("pac-card");
//   const input = document.getElementById("pac-input");
//   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
//   const autocomplete = new google.maps.places.Autocomplete(input, options); // Bind the map's bounds (viewport) property to the autocomplete object,
//   // so that the autocomplete requests use the current map bounds for the
//   // bounds option in the request.
//   autocomplete.bindTo("bounds", map); // Set the data fields to return when the user selects a place.
//   // photos, place_id, types, formatted_address, name, rating, geometry;
//   const completeFields = [
//     "address_components",
//     "place_id",
//     "geometry",
//     "icon",
//     "name",
//     "photos",
//     "types",
//     "formatted_address",
//     "name",
//     "rating",
//     "formatted_phone_number",
//     "reviews",
//     "website",
//     "opening_hours",
//     "price_level",
//     "types",
//   ];
//   autocomplete.setFields(completeFields);
//   const infowindow = new google.maps.InfoWindow();
//   const infowindowContent = document.getElementById("infowindow-content");
//   console.log("info", infowindow);
//   infowindow.setContent(infowindowContent);
//   const marker = new google.maps.Marker({
//     map,
//     anchorPoint: new google.maps.Point(0, -29),
//   });
//   autocomplete.addListener("place_changed", () => {
//     infowindow.close();
//     marker.setVisible(false);
//     const place = autocomplete.getPlace();
//     const placeData = {
//       ...place,
//       geometry: {
//         longitude: place.geometry.location.lng(),
//         latitude: place.geometry.location.lat(),
//       },
//       imgSrc: place.photos[0].getUrl(),
//       city: place.address_components[2].long_name,
//       tags: place.types,
//     };
//     document.getElementById("placeData").value = JSON.stringify(placeData);

//     console.log("LOGS place", placeData);
//     if (!place.geometry) {
//       // User entered the name of a Place that was not suggested and
//       // pressed the Enter key, or the Place Details request failed.
//       window.alert("No details available for input: '" + place.name + "'");
//       return;
//     } // If the place has a geometry, then present it on a map.

//     if (place.geometry.viewport) {
//       map.fitBounds(place.geometry.viewport);
//     } else {
//       map.setCenter(place.geometry.location);
//       map.setZoom(17); // Why 17? Because it looks good.
//     }

//     marker.setPosition(place.geometry.location);
//     marker.setVisible(true);
//     let address = "";

//     if (place.address_components) {
//       address = [
//         (place.address_components[0] &&
//           place.address_components[0].short_name) ||
//         "",
//         (place.address_components[1] &&
//           place.address_components[1].short_name) ||
//         "",
//         (place.address_components[2] &&
//           place.address_components[2].short_name) ||
//         "",
//       ].join(" ");
//     }

//     infowindowContent.children["place-icon"].src = place.icon;
//     infowindowContent.children["place-name"].textContent = place.name;
//     infowindowContent.children["place-address"].textContent = address;
//     infowindow.open(map, marker);
//   }); // Sets a listener on a radio button to change the filter type on Places
//   // Autocomplete.

//   function setupClickListener(id, types) {
//     const radioButton = document.getElementById(id);
//     radioButton.addEventListener("click", () => {
//       autocomplete.setTypes(types);
//     });
//   }

//   setupClickListener("changetype-all", []);
//   setupClickListener("changetype-address", ["address"]);
//   setupClickListener("changetype-establishment", ["establishment"]);
//   setupClickListener("changetype-geocode", ["geocode"]);
//   document
//     .getElementById("use-strict-bounds")
//     .addEventListener("click", function () {
//       console.log("Checkbox clicked! New state=" + this.checked);
//       autocomplete.setOptions({
//         strictBounds: this.checked,
//       });
//     });
// }