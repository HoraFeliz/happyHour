"use strict";

const tourId = window.location.href.split("tours/tour/")[1];

axios.get(`/tours/tour/map/${tourId}`).then((response) => {
  console.log("res", response.data.places);
});

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: {
      lat: 40.416511,
      lng: -3.705247,
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
  const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  var myLatLng = { lat: -25.363, lng: 131.044 };
  const beachMarker = new google.maps.Marker({
    location: myLatLng,
    map,
    icon: image,
  });

  directionsRenderer.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const waypts = [
    {
      location: "Los Huevos de Lucio, Calle de la Cava Baja, 30, 28005 Madrid",
      stopover: true,
    },
    {
      location:
        "Sidrería Casa Antonio La Latina Madrid | Restaurante Asturiano, Plaza de la Cebada, 12, 28005 Madrid",
      stopover: true,
    },
  ];

  directionsService.route(
    {
      origin: "La Lata Cascorro, Calle de Embajadores, 1, 28012 Madrid",
      destination:
        "La Cabra en el Tejado, Calle de Santa Ana, 29, 28005 Madrid",
      waypoints: waypts,
      optimizeWaypoints: true,
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

initMap();
