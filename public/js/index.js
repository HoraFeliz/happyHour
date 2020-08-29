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

//Read More

function readMore() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = '<img src="/img/more-info-button.png" alt="Read More"> Read More';
    btnText.classList.add('read-more')
    btnText.classList.remove("read-less")
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = '<img src="/img/less-info-button.png" alt="Read More"> Read Less';
    btnText.classList.remove("read-more")
    btnText.classList.add('read-less')
    moreText.style.display = "inline";
  }
}
