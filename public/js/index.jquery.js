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
});
