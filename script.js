document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
var btn = document.querySelector(".menu-btn");
var menu = document.getElementById("navlinks");
function setMenu(open) {
  menu.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.textContent = open ? "Close" : "Menu";
}
btn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
menu.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });

if ("IntersectionObserver" in window) {
  // Current section in the nav
  var links = document.querySelectorAll(".navlinks a");
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + e.target.id;
        a.classList.toggle("active", on);
        if (on) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("section[id]").forEach(function (s) { spy.observe(s); });

  // Gentle reveal for cards as they scroll into view
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    var items = document.querySelectorAll(".card, .job, .edu");
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add("in");
        reveal.unobserve(el);
        setTimeout(function () { el.classList.remove("reveal", "in"); }, 700);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top > window.innerHeight) { el.classList.add("reveal"); reveal.observe(el); }
    });
  }
}

// Reading progress bar and back-to-top button
var bar = document.getElementById("bar");
var totop = document.getElementById("totop");
var ticking = false;
function onScroll() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  var y = window.pageYOffset;
  bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
  totop.classList.toggle("show", y > 600);
  ticking = false;
}
window.addEventListener("scroll", function () {
  if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

// Copy email
var copyBtn = document.getElementById("copy-email");
var status = document.getElementById("copy-status");
copyBtn.addEventListener("click", function () {
  var email = document.getElementById("email-link").textContent;
  function done() {
    copyBtn.textContent = "Copied";
    status.textContent = "Email address copied";
    setTimeout(function () { copyBtn.textContent = "Copy"; status.textContent = ""; }, 1800);
  }
  if (navigator.clipboard) { navigator.clipboard.writeText(email).then(done); } else { done(); }
});
