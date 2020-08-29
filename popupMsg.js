"use strict";

function setupPopupMsg(heading = "", body = "") {
   document.querySelector("#error-heading").textContent = heading;
   document.querySelector("#error-body").innerHTML = body;
}

function showPopupMsg() {
   document.querySelector("#error-container").classList.remove("hidden-error-container");
}

function hidePopupMsg() {
   document.querySelector("#error-container").classList.add("hidden-error-container");
}

export { setupPopupMsg, showPopupMsg, hidePopupMsg };

