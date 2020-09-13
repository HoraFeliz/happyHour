"use strict";

const red = 'rgb(200,16,46)'


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

  // Create Marker
  // new google.maps.Marker({
  //   position: map.getCenter(),
  //   icon: {
  //     path: google.maps.SymbolPath.CIRCLE,
  //     scale: 10
  //   },
  //   draggable: true,
  //   map: map
  // });


  directionsRenderer.setMap(map);
  directionsRenderer.setOptions({
    // suppressMarkers: true,
    markerOptions: {
      icon: '/img/marker-appy.svg',
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
      text: 'Hello'
    },


  });
  calculateAndDisplayRoute(directionsService, directionsRenderer);
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  const waypts = [{
    location: "Los Huevos de Lucio",
    stopover: true,
  },
  {
    location: "Sidrería Casa Antonio La Latina Madrid | Restaurante Asturiano, Plaza de la Cebada, 12, 28005 Madrid",
    stopover: true
  },
  {
    location: "Malacatín, Calle de la Ruda, 5, 28005 Madrid",
    stopover: true
  },
  ];
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


  directionsService.route({
    origin: 'La Lata Cascorro, Calle de Embajadores, 1, 28012 Madrid',
    destination: 'La Cabra en el Tejado, Calle de Santa Ana, 29, 28005 Madrid',
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
          summaryPanel.innerHTML +=
            route.legs[i].distance.text + "<br><br>";
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

initMap();