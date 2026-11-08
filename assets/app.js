// Amélioration progressive : le site fonctionne sans ce script.
(function () {
  document.documentElement.classList.add("js");

  // Replié sur mobile, toujours ouvert au-delà d'un seuil (menu dès 48 rem, sommaire dès 64 rem).
  function foldBelow(details, query) {
    if (!details || !window.matchMedia) { return; }
    var wide = window.matchMedia(query);
    var summary = details.querySelector("summary");
    // Au-delà du seuil, le titre n'est plus un bouton : hors tabulation, et il ne replie plus.
    var sync = function () { details.open = wide.matches; summary.tabIndex = wide.matches ? -1 : 0; };
    sync();
    summary.addEventListener("click", function (e) { if (wide.matches) { e.preventDefault(); } });
    if (wide.addEventListener) { wide.addEventListener("change", sync); }
  }
  var nav = document.querySelector(".nav details");
  foldBelow(nav, "(min-width: 48rem)");
  foldBelow(document.querySelector(".toc details"), "(min-width: 64rem)");

  // Menu mobile : Échap ou clic hors du menu le referme.
  if (nav) {
    var narrow = function () { return !window.matchMedia || !window.matchMedia("(min-width: 48rem)").matches; };
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.open && narrow()) { nav.open = false; nav.querySelector("summary").focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.open && narrow() && !nav.contains(e.target)) { nav.open = false; }
    });
  }

  // Une question ciblée par l'adresse (faq.html#q-email) s'ouvre d'elle-même.
  function openTarget() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (el && el.matches("details.q")) { el.open = true; }
  }
  openTarget();
  window.addEventListener("hashchange", openTarget);

  // Sommaire : marque la section en cours de lecture.
  var links = document.querySelectorAll(".toc a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        byId[en.target.id].setAttribute("aria-current", "true");
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { io.observe(el); }
    });
  }

  // Copie de l'adresse de support.
  var link = document.getElementById("mail-link");
  var slot = document.getElementById("copy-slot");
  if (link && slot && navigator.clipboard) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-ghost";
    btn.textContent = "Copier l'adresse";
    var status = document.createElement("span");
    status.className = "copy-status";
    status.setAttribute("role", "status");
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(link.textContent.trim()).then(function () {
        status.textContent = "Adresse copiée";
      }, function () {
        status.textContent = "Copie impossible : sélectionnez l'adresse.";
      });
    });
    slot.appendChild(btn);
    slot.appendChild(status);
  }
})();
