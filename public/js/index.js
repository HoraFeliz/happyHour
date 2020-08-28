document.querySelectorAll("[data-enable]").forEach((el) => {
  el.addEventListener("click", function () {
    const target = document.getElementById(this.dataset.enable);

    target.disabled = !target.disabled;

    if (target.type === "file") {
      target.closest("form").enctype = target.disabled
        ? "application/x-www-form-urlencoded"
        : "multipart/form-data";
    }

    if (!target.disabled) {
      target.click();
    }
  });
});

document.querySelectorAll("[data-like-place]").forEach((el) => {
  el.addEventListener("click", function () {
    axios.post(`/places/${this.dataset.likePlace}/like`).then((response) => {
      const likesContainer = this.querySelector(".likes-count");

      likesContainer.innerText =
        Number(likesContainer.innerText) + response.data.like;
    });
  });
});

// //maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=API-KEY

// // const getPlaceInfo = (placeName) => {
// const getPlaceInfo = () => {
//   axios
//     .get(
//       `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=MuseumofContemporaryArt&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=API_KEY`
//     )
//     .then((response) => {
//       console.log("Response from API is: ", response);
//       // const countryDetail = response.data[0];
//       // console.log("a single country details: ", countryDetail);
//     })
//     .catch((err) => console.log(err));
// };

// document.getElementById("get-country-btn").addEventListener("click", () => {
//   //const userInput = document.getElementById("country-name-input").value;
//   //getCountryInfo(userInput);
//   getPlaceInfo();
// });
