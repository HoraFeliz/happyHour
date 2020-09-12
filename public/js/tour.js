"use strict";

const red = "rgb(200,16,46)";
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

    directionsRenderer.setMap(map);
    directionsRenderer.setOptions({
      markerOptions: {
        icon: "/img/marker-appy.svg",
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
  });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  let waypts = [];
  placesAndCoordinates.forEach((place) => {
    let waypoint = {
      location: `${place.name}, ${place.address}`,
      stopover: false,
    };
    waypts.push(waypoint);
  });

  directionsService.route(
    {
      origin: `${placesAndCoordinates[0].name}, ${placesAndCoordinates[0].address}`,
      origin: `${placesAndCoordinates[1].name}, ${placesAndCoordinates[1].address}`,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.WALKING,
    },
    (response, status) => {
      if (status === "OK") {
        console.log("res", response);
        directionsRenderer.setDirections(response);

        const route = response.routes[0];
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
