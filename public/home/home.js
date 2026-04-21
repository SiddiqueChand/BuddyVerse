$(window).scroll(function() {
  parallax();
})

function parallax() {
  var wScroll = $(window).scrollTop();
  $('.parallax--bg').css('background-position', 'center ' + (wScroll*0.75)+'px');
  $('.parallax--box').css('top', -5 + (wScroll*.005)+'em');
};

const userName = document.querySelector(".user-name");
const userIcon = document.querySelector("#userIcon");
userName.addEventListener("mouseover", () => {
  userName.style.color = "#0f2c56";
  userIcon.style.fill = "#0f2c56";
});

userName.addEventListener("mouseout", () => {
  userName.style.color = "#3E5E8D";
  userIcon.style.fill = "#3E5E8D";
});