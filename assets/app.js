// Amélioration progressive : le site fonctionne sans ce script.
(function () {
  document.documentElement.classList.add("js");

  // Menu : replié sur mobile, toujours ouvert dès 48 rem.
  var nav = document.querySelector(".nav details");
  if (nav && window.matchMedia) {
    var wide = window.matchMedia("(min-width: 48rem)");
    var sync = function () { nav.open = wide.matches; };
    sync();
    if (wide.addEventListener) { wide.addEventListener("change", sync); }
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
    slot.appendChild(document.createTextNode(" "));
    slot.appendChild(btn);
    slot.appendChild(status);
  }
})();
