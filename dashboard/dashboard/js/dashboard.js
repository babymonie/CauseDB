
$(document).ready(function() {
  $(".side-btn").click(function() {
    $(this).next('.dropdown-content').slideToggle();
    $(this).find('.dropdown').toggleClass('rotate');
  });
  $(".menu-btn").click(function() {
    $('.side-bar').addClass('active');
  });
  $(".close").click(function() {
    $('.side-bar').removeClass('active');
  });
});
function loadData() {
  fetch("/database", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })  
    .then((response) => response.json())
    .then((data) => {
      if (data.success == true) {
        var databases = data.databases;
        var html = "";
        for (var i = 0; i < databases.length; i++) {
          html += `<div class="dropdown-item">
          <a href="/database/${databases[i]}">${databases[i]}</a>
        </div>`;
        }
        $("#database").html(html);
        return true;
      } else {
        console.log("Token is invalid");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
document.onload = loadData();