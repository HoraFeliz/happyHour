"use strict";

const red = "rgb(200,16,46)";
const tourId = window.location.href.split("tours/tour/")[1];

let placesAndCoordinates;

axios.get(`/tours/tour/map/${tourId}`).then((response) => {
  placesAndCoordinates = response.data.places;
  initMap();
});

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  // const directionsRendererOptions = new google.maps.DirectionsRendererOptions();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: {
      lat: 40.416511,
      lng: -3.705247,
    },
  });

  directionsRenderer.setMap(map);
  directionsRenderer.setOptions({
    // suppressMarkers: true,
    markerOptions: {
      icon: "/img/marker-appy.svg",
      // title: 'place',
      // markerLabel: {
      //   text: 'Hello'
      // }
    },
    polylineOptions: {
      strokeColor: red,
      strokeWeight: 6,
    },
    markerLabel: {
      text: "Hello",
    },
  });
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  let waypts = [];
  const origin = placesAndCoordinates.shift();
  const destination = placesAndCoordinates.pop();

  placesAndCoordinates.forEach((place) => {
    let waypoint = {
      location: `${place.name}, ${place.address}`,
      stopover: true,
    };
    waypts.push(waypoint);
  });

  // const checkboxArray = document.getElementById("waypoints");

  // for (let i = 0; i < checkboxArray.length; i++) {
  //     if (checkboxArray.options[i].selected) {
  //         console.log(checkboxArray[i].value)
  //         waypts.push({
  //             location: checkboxArray[i].value,
  //             stopover: true
  //         });
  //     }
  // }

  directionsService.route(
    {
      origin: `${origin.name}, ${origin.address}`,
      destination: `${destination.name}, ${destination.address}`,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = ""; // For each route, display summary information.

        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
          summaryPanel.innerHTML +=
            "<b>Route Segment: " + routeSegment + "</b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}
