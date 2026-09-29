var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active-accordion");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

var calcBtn = document.getElementById("calc-btn");
if (calcBtn) {
    calcBtn.onclick = function() {
        var watts = document.getElementById("wattage").value;
        var hours = document.getElementById("hours").value;
        var price = document.getElementById("price").value;

        if (watts > 0 && hours > 0 && price > 0) {
            document.getElementById("calc-error").style.display = "none";
            
            var dailyKWh = (watts * hours) / 1000;
            var monthlyKWh = dailyKWh * 30;
            var monthlyCost = (monthlyKWh * price) / 100;

            document.getElementById("res-daily").innerHTML = dailyKWh.toFixed(2);
            document.getElementById("res-monthly").innerHTML = monthlyKWh.toFixed(2);
            document.getElementById("res-cost").innerHTML = monthlyCost.toFixed(2);
            
            document.getElementById("calc-results").style.display = "block";
        } else {
            document.getElementById("calc-error").style.display = "block";
            document.getElementById("calc-results").style.display = "none";
        }
    };
}