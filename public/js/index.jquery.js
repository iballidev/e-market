$(function () {
  function init() {
    isUser = false;
  }

  init();

  $(".dropdown-toggle").on("click", function () {
    var x = $(this).next();
    if (x) {
      x.toggleClass("show");
      x.css({
        right: "0",
        left: "auto",
      });
    }
    x.on("mouseleave", function () {
      x.removeClass("show");
    });
  });

  $.ajax({
    url: "http://localhost:8080/user-account/user",
    type: "GET",
    success: function (response) {
      console.log("response: ", response);
      if (response) {
        console.log("response ++: ", response);
        isUser = true;
        $(".isLoggedIn").css({ display: "none" });
      } else {
        console.log("response --: ", response);
        isUser = false;
        $(".isLoggedIn").css({ display: "block" });
      }
      console.log("isUser: ", isUser);
    },
  });
});
