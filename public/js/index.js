document.addEventListener("DOMContentLoaded", domFunctions);

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
    btnText.innerHTML = '<img src="/img/more-info-button.png" class="mr-2" alt="Read More">';
    btnText.classList.add('read-more')
    btnText.classList.remove("read-less")
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = '<img src="/img/less-info-button.png" class="mr-2" alt="Read More"> ';
    btnText.classList.remove("read-more")
    btnText.classList.add('read-less')
    moreText.style.display = "inline";
  }
}

function readMoreText() {
  const dot = document.getElementById('dotdotdot-descrip').innerHTML
  const myBtn = document.getElementById('myBtn')
  const textLenght = 100

  if (dot.length > textLenght) {
    document.getElementById('dotdotdot-descrip').innerHTML = dot.substring(0, textLenght) + '<span id="dots">...</span><span id="more">' + dot.substring(textLenght + 1, dot.length) + '</span></span>'
  } else {
    myBtn.style.display = 'none'
  }

}

function beerRating() {
  // Beer Rating
  const beerRatingDiv = document.getElementById('tour-detail-your-rating')
  const beerRatingDiv01 = document.getElementById('beer-rating-cont-01')
  const beerRatingDiv02 = document.getElementById('beer-rating-cont-02')
  const beerRatingDiv03 = document.getElementById('beer-rating-cont-03')
  const beerRatingDiv04 = document.getElementById('beer-rating-cont-04')
  const beerRatingDiv05 = document.getElementById('beer-rating-cont-05')
  const beerOne = document.getElementById('beer-01')
  const beerTwo = document.getElementById('beer-02')
  const beerThree = document.getElementById('beer-03')
  const beerFour = document.getElementById('beer-04')
  const beerFive = document.getElementById('beer-05')

  beerOne.addEventListener("mouseover", function () {
    beerOne.src = '/img/your-rating-on.png'
    beerTwo.src = '/img/your-rating-off.png'
    beerThree.src = '/img/your-rating-off.png'
    beerFour.src = '/img/your-rating-off.png'
    beerFive.src = '/img/your-rating-off.png'
  })
  beerTwo.addEventListener("mouseover", function () {
    beerOne.src = '/img/your-rating-on.png'
    beerTwo.src = '/img/your-rating-on.png'
    beerThree.src = '/img/your-rating-off.png'
    beerFour.src = '/img/your-rating-off.png'
    beerFive.src = '/img/your-rating-off.png'
  })
  beerThree.addEventListener("mouseover", function () {
    beerOne.src = '/img/your-rating-on.png'
    beerTwo.src = '/img/your-rating-on.png'
    beerThree.src = '/img/your-rating-on.png'
    beerFour.src = '/img/your-rating-off.png'
    beerFive.src = '/img/your-rating-off.png'
  })
  beerFour.addEventListener("mouseover", function () {
    beerOne.src = '/img/your-rating-on.png'
    beerTwo.src = '/img/your-rating-on.png'
    beerThree.src = '/img/your-rating-on.png'
    beerFour.src = '/img/your-rating-on.png'
    beerFive.src = '/img/your-rating-off.png'
  })
  beerFive.addEventListener("mouseover", function () {
    beerOne.src = '/img/your-rating-on.png'
    beerTwo.src = '/img/your-rating-on.png'
    beerThree.src = '/img/your-rating-on.png'
    beerFour.src = '/img/your-rating-on.png'
    beerFive.src = '/img/your-rating-on.png'
  })
  beerRatingDiv.addEventListener("mouseleave", function () {
    beerOne.src = '/img/your-rating-off.png'
    beerTwo.src = '/img/your-rating-off.png'
    beerThree.src = '/img/your-rating-off.png'
    beerFour.src = '/img/your-rating-off.png'
    beerFive.src = '/img/your-rating-off.png'
  })
}

function domFunctions() {
  // console.log('DOM Init');
  // beerRating()
  readMoreText()
}

function goBack() {
  window.history.back();
}