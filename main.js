"use strict";
import * as popupMsg from "./popupMsg.js";
//console.log(popupMsg.name);
//let num = 100;
//let hexCode = num.toString(16);
//console.log( hexCode );

let pallete = {
   hexCodes: {
      r: "00",
      g: "00",
      b: "00",
   },
   increValue: {
      r: 10,
      g: 5,
      b: 20,
   },
   updateTime: 25,

   setColor(color, value = "00", callback = null) {
      value = value.trim();

      // fix value if it is not large enough or an empty string
      if (value.length === 1) {
         value = "0" + value;
      } else if (value.length === 0) {
         value = "00";
      }

      // validate value
      let hexRegex = /^[0-9a-f][0-9a-f]/;
      let checkHexRegex = hexRegex.test(value);

      try {
         if (checkHexRegex) {
            this.hexCodes[color] = value;
            return;
         }

         throw new Error("The argument is not written in hexadecimal");
      } catch (error) {
         // shows an error when the value is not an hexadecimal code
         console.log(error);
         if (callback) callback(value);
      }
   },

   setIncreaseVal(color, value = 1) {
      if (!isNaN(value) && value >= 1 && value <= 50) {
         this.increValue[color] = value;
         return;
      }

      this.increValue[color] = 5;
   },

   hexToNum(color) {
      let colorVal = parseInt(this.hexCodes[color], 16); // converts hex code to an integer
      return isNaN(colorVal) ? 0 : colorVal;
   },

   increaseHexValue() {
      let colorKey = Object.keys( this.hexCodes );

      for (let i = 0; i < colorKey.length; i++) {
         let hexValue = this.hexToNum( colorKey[i] );
         let incrementHex = hexValue += this.increValue[ colorKey[i] ];

         if (incrementHex > 255) incrementHex = 0;

         let backToHex = incrementHex.toString(16);

         // Add extra zero
         if (backToHex.length == 1) {
            this.hexCodes[ colorKey[i] ] = "0" + backToHex;
         } else {
            this.hexCodes[ colorKey[i] ] = backToHex;
         }
      }
   }
};

const cycle = document.querySelector("#cycle-content");
const cycleValueElement = document.querySelector("#cycle-color-value");
// hex fields
const rHexInput = document.querySelector("#r"),
      gHexInput = document.querySelector("#g"),
      bHexInput = document.querySelector("#b");
// increase value fields
const rIncrementInput = document.querySelector("#increment-r"),
      gIncrementInput = document.querySelector("#increment-g"),
      bIncrementInput = document.querySelector("#increment-b");

const setColorBtn = document.querySelector("#setColor");
const startBtn = document.querySelector("#toggleTimer");
const activeToDisableFields = document.querySelectorAll(".act-to-dis");
let cycleIsOn = false;
let interval = null;
let errors = [];
let showError = false;

setColorBtn.addEventListener("click", () => {
   setIncrementValues();
   setNewColor();
   setCycleContrainerBgc();
   setCycleValueElement();

   console.log(pallete.hexCodes);
   console.log(pallete.increValue);
});

startBtn.addEventListener("click", (evt) => {
   if (!cycleIsOn) { // power on
      setCycleContrainerBgc();
      disableFields();
      interval = setInterval(() => {
         pallete.increaseHexValue();
         setCycleContrainerBgc();
         setCycleValueElement();
      }, 25*100);
      evt.target.textContent = "Stop";
      cycleIsOn = true;
   } else if (cycleIsOn) { // power off
      disableFields(false);
      clearInterval(interval);
      evt.target.textContent = "Start";
      cycleIsOn = false;
   }
});

document.querySelector("#error-close-button").addEventListener("click", popupMsg.hidePopupMsg);

function setIncrementValues() {
   let rValue = +rIncrementInput.value;
   let gValue = +gIncrementInput.value;
   let bValue = +bIncrementInput.value;

   pallete.setIncreaseVal("r", rValue);
   pallete.setIncreaseVal("g", gValue);
   pallete.setIncreaseVal("b", bValue);

   rIncrementInput.value = pallete.increValue.r;
   gIncrementInput.value = pallete.increValue.g;
   bIncrementInput.value = pallete.increValue.b;
}

let handleError = function(badHexcode) {
   errors.push(badHexcode);

   let errorsStr = errors.join(" - ");
   let errorMsg = (errors.length === 1) ? 
       `This is not a valid hexadecimal code: <span class="invalid-hexcode"><strong>${errorsStr}</strong></span>` :
       `These are not valid hexadecimal codes: <span class="invalid-hexcode"><strong>${errorsStr}</strong></span>`;

   popupMsg.setupPopupMsg("Invalid value", errorMsg);
   showError = true;
}

function setNewColor() {
   let rValue = rHexInput.value.trim();
   let gValue = gHexInput.value.trim();
   let bValue = bHexInput.value.trim();

   errors = [];
   showError = false;
   pallete.setColor("r", rValue, handleError);
   pallete.setColor("g", gValue, handleError);
   pallete.setColor("b", bValue, handleError);

   if (showError) {
      popupMsg.showPopupMsg();
   } else {
      popupMsg.hidePopupMsg();
   }
}

function setCycleContrainerBgc() {
   let { hexCodes: {r, g, b} } = pallete;
   cycle.style.backgroundColor = "#" + r + g + b; 
}

function setCycleValueElement() {
   let bgcValue = cycle.style.backgroundColor;
   let bgcValueRegex = /[0-9][0-9][0-9]|[0-9][0-9]|[0-9]/g;
   let values = bgcValue.match(bgcValueRegex);
   let colorBrightness = +values[0] + +values[1] + +values[2];
   let hexadecimalCode = "#";

   for (let i = 0; i < values.length; i++) {
      values[i] = +values[i];
      values[i] = values[i].toString(16);

      // Add extra zero
      if (values[i].length === 1) {
         hexadecimalCode += "0" + values[i];
         continue;
      }

      hexadecimalCode += values[i];
   }

   cycleValueElement.textContent = hexadecimalCode;
   
   if (colorBrightness <= 350) {
      cycleValueElement.style.color = "#fafafa";
   } else {
      cycleValueElement.style.color = "#0f0f0f";
   }
}

function disableFields(disabled = true) {
   if (disabled) {
      activeToDisableFields.forEach(node => {
         node.setAttribute("disabled", "disabled");
         node.classList.add("disable-field");
      });
   } else {
      activeToDisableFields.forEach(node => {
         node.removeAttribute("disabled");
         node.classList.remove("disable-field");
      });
   }
}