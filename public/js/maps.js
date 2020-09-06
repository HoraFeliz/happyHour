const placeList = [];

// document.getElementById("pac-input").addEventListener("change", addPlace);

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

  console.log("input", input);

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  const autocomplete = new google.maps.places.Autocomplete(input, options); // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  console.log("auto", autocomplete.getPlace());
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

  const placeDataList = [];

  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

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

      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      } // If the place has a geometry, then present it on a map.

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      let address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
            "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
            "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
            "",
        ].join(" ");
      }

      infowindowContent.children["place-icon"].src = place.icon;
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = address;
      infowindow.open(map, marker);
    }
  });
}
