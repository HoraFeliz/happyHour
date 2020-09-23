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

document.querySelectorAll("#check-tour").forEach((el) => {
  el.addEventListener("click", function () {
    if (el.classList.contains("fa-times")) {
      el.classList.remove("fa");
      el.classList.remove("fa-times");
      el.classList.add("fa");
      el.classList.add("fa-check");
    } else {
      el.classList.remove("fa");
      el.classList.remove("fa-check");
      el.classList.add("fa");
      el.classList.add("fa-times");
    }

    console.log("clicked", el);
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
    btnText.innerHTML =
      '<img src="/img/more-info-button.png" class="mr-2" alt="Read More">';
    btnText.classList.add("read-more");
    btnText.classList.remove("read-less");
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML =
      '<img src="/img/less-info-button.png" class="mr-2" alt="Read More"> ';
    btnText.classList.remove("read-more");
    btnText.classList.add("read-less");
    moreText.style.display = "inline";
  }
}

function readMoreText() {
  const dot = document.getElementById("dotdotdot-descrip").innerHTML;
  const myBtn = document.getElementById("myBtn");
  const textLenght = 100;

  if (dot.length > textLenght) {
    document.getElementById("dotdotdot-descrip").innerHTML =
      dot.substring(0, textLenght) +
      '<span id="dots">...</span><span id="more">' +
      dot.substring(textLenght + 1, dot.length) +
      "</span></span>";
  } else {
    myBtn.style.display = "none";
  }
}

function domFunctions() {
  // console.log('DOM Init');
  // beerRating()
  burbujas();
  readMoreText();
}

function goBack() {
  window.history.back();
}

// function burbujas() {
//   const burbujas = document.getElementById('main-appy')
//   for (b = 0; b < 1000; b++) {
//     // burbujas.style.backgroundPosition += b
//     setTimeout(() => {
//       console.log(b);
//     }, 1000)
//   }
// }

var position = 0

function burbujas() {

  const burbujasBack = document.getElementById('main-appy')
  // add a zero in front of numbers<10
  position -= 120
  burbujasBack.style.backgroundPositionY = `${position}px`;
  setTimeout(function () { burbujas() }, 1000);
  // console.log(position);
}

// function checkPosition(i) {
//   if (i < 1000) {
//     i -= 20
//     console.log(i);
//   }
//   return i;
// }
