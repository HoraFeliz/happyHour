"use strict";

const tourId = window.location.href.split("tours/tour/")[1];

let placesAndCoordinates;

axios.get(`/tours/tour/map/${tourId}`).then((response) => {
  placesAndCoordinates = response.data.places;
  initMap();
});

function initMap() {
  const tourId = window.location.href.split("tours/tour/")[1];

  let placesAndCoordinates;

  axios.get(`/tours/tour/map/${tourId}`).then((response) => {
    placesAndCoordinates = response.data.places;
    console.log("response", response.data.places);

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: {
        lat: placesAndCoordinates[0].location.coordinates[1],
        lng: placesAndCoordinates[0].location.coordinates[0],
      },
    });
    new google.maps.Marker({
      position: map.getCenter(),
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
      },
      draggable: true,
      map: map,
    });

    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const waypts = [
    {
      location: `${placesAndCoordinates[0].name}, ${placesAndCoordinates[0].address}`,
      stopover: true,
    },
    {
      location: `${placesAndCoordinates[1].name}, ${placesAndCoordinates[1].address}`,
      stopover: true,
    },
  ];

  directionsService.route(
    {
      origin: `${placesAndCoordinates[0].name}, ${placesAndCoordinates[0].address}`,
      destination: `${placesAndCoordinates[1].name}, ${placesAndCoordinates[1].address}`,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (response, status) => {
      if (status === "OK") {
        console.log("res", response);
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
