"use strict";

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCPJpjD-qcR_yIxJnS8maR5W9KB0E3EzYI&libraries=places">
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 40.416511,
      lng: -3.705247,
    },
    zoom: 13,
  });

  const options = {
    types: ["establishment"],
  };
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  const autocomplete = new google.maps.places.Autocomplete(input, options); // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map); // Set the data fields to return when the user selects a place.
  // photos, place_id, types, formatted_address, name, rating, geometry;
  const completeFields = [
    "address_components",
    "place_id",
    "geometry",
    "icon",
    "name",
    "photos",
    "types",
    "formatted_address",
    "name",
    "rating",
    "formatted_phone_number",
    "reviews",
    "website",
    "opening_hours",
    "price_level",
    "types",
  ];
  autocomplete.setFields(completeFields);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  console.log("info", infowindow);
  infowindow.setContent(infowindowContent);
  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });
  // const placesArray = [];
  // function savePlace() {
  //   const place = autocomplete.getPlace();
  //   if (place) {
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

  //     console.log("LOGS place", placeData);
  //     for (let index = 0; index < placesArray.length < 2; index++) {
  //       placesArray.push(placeData.name);
  //     }
  //     console.log("arr", placesArr);
  //   }
  // }

  const placeList = [];
  const placeDataList = [];
  autocomplete.addListener("place_changed", () => {
    console.log("place just changed");
    const place = autocomplete.getPlace();
    if (place) {
      let placeData = {
        ...place,
        geometry: {
          longitude: place.geometry.location.lng(),
          latitude: place.geometry.location.lat(),
        },
        imgSrc: place.photos[0].getUrl(),
        city: place.address_components[2].long_name,
        tags: place.types,
      };
      document.getElementById("placeData").value = JSON.stringify(placeData);
      placeList.push(place);
      placeDataList.push(placeData);
      console.log("placeList", placeDataList);
      document.getElementById("placeData").value = JSON.stringify(
        placeDataList
      );
      document.getElementById("placeDataTest").innerText = JSON.stringify(
        placeDataList
      );
    }

    infowindow.close();
    marker.setVisible(false);

    //document.getElementById("placeData").value = JSON.stringify(placeData);
  });
}
