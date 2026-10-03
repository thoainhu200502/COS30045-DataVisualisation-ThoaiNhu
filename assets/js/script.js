// 1. FAQ ACCORDION
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

// 2. ENERGY CALCULATOR
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

// 3. D3.JS & SVG INTERACTIVE CHARTS (FULL 29 BARS + PIE CHART)

if (typeof d3 !== "undefined") {
    var tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#2c3e50")
        .style("color", "#fff")
        .style("padding", "8px 12px")
        .style("border-radius", "5px")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("box-shadow", "0 4px 10px rgba(0,0,0,0.2)")
        .style("z-index", "9999")
        .style("opacity", 0);

    // CHART 1: D3.JS INTERACTIVE PIE CHART 
    if (document.getElementById("d3-pie-chart")) {
        var pieData = [
            { brand: "EKO", count: 55, color: "#4e67c8" },
            { brand: "JVC", count: 46, color: "#8cc665" },
            { brand: "AIWA", count: 45, color: "#f7c852" },
            { brand: "BAUHN", count: 31, color: "#eb6559" },
            { brand: "BLAUPUNKT", count: 30, color: "#68b5dc" },
            { brand: "TOSHIBA", count: 27, color: "#349d6b" },
            { brand: "LOEWE", count: 22, color: "#f37b43" },
            { brand: "HISENSE", count: 14, color: "#905aa6" },
            { brand: "Linsar", count: 14, color: "#e573b9" },
            { brand: "ENGLAON", count: 13, color: "#4669c4" },
            { brand: "Other", count: 68, color: "#8bc567" }
        ];

        var width1 = 440;
        var height1 = 340;
        var radius = 110;

        var svgPie = d3.select("#d3-pie-chart")
            .append("svg")
            .attr("viewBox", "0 0 " + width1 + " " + height1)
            .style("width", "100%")
            .style("height", "auto")
            .append("g")
            .attr("transform", "translate(" + (width1 / 2) + "," + (height1 / 2) + ")");

        var pie = d3.pie()
            .sort(null)
            .value(function(d) { return d.count; });

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var arcHover = d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 10);

        var labelArc = d3.arc()
            .innerRadius(radius + 25)
            .outerRadius(radius + 25);

        svgPie.selectAll("path")
            .data(pie(pieData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d) { return d.data.color; })
            .attr("stroke", "#fff")
            .style("stroke-width", "1.5px")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).transition().duration(150).attr("d", arcHover);
                tooltip.style("opacity", 1)
                       .html(d.data.brand + ": " + d.data.count + " models")
                       .style("left", (event.pageX + 12) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).transition().duration(150).attr("d", arc);
                tooltip.style("opacity", 0);
            });

        svgPie.selectAll("text")
            .data(pie(pieData))
            .enter()
            .append("text")
            .attr("transform", function(d) {
                var c = labelArc.centroid(d);
                return "translate(" + c[0] + "," + c[1] + ")";
            })
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(function(d) { return d.data.brand; });
    }

    // CHART 2: D3.JS INTERACTIVE BAR CHART 
    if (document.getElementById("d3-bar-chart")) {
        var barData = [
            { brand: "EKO", count: 55, color: "#4e67c8" },
            { brand: "JVC", count: 46, color: "#8cc665" },
            { brand: "AIWA", count: 45, color: "#f7c852" },
            { brand: "BAUHN", count: 31, color: "#eb6559" },
            { brand: "BLAUPUNKT", count: 30, color: "#68b5dc" },
            { brand: "TOSHIBA", count: 27, color: "#349d6b" },
            { brand: "LOEWE", count: 22, color: "#f37b43" },
            { brand: "HISENSE", count: 14, color: "#905aa6" },
            { brand: "Linsar", count: 14, color: "#e573b9" },
            { brand: "ENGLAON", count: 13, color: "#4669c4" },
            { brand: "DGTEC", count: 9, color: "#8cc665" },
            { brand: "PRISM+", count: 8, color: "#f7c852" },
            { brand: "Monster", count: 7, color: "#eb6559" },
            { brand: "AKAI", count: 6, color: "#68b5dc" },
            { brand: "KOGAN", count: 5, color: "#349d6b" },
            { brand: "TEAC", count: 5, color: "#f37b43" },
            { brand: "FPD", count: 4, color: "#905aa6" },
            { brand: "Avel Innovations", count: 3, color: "#e573b9" },
            { brand: "Altius", count: 2, color: "#4e67c8" },
            { brand: "Blaupunkt", count: 2, color: "#8cc665" },
            { brand: "HYUNDAI", count: 2, color: "#f7c852" },
            { brand: "Hubl", count: 2, color: "#eb6559" },
            { brand: "Laser", count: 2, color: "#68b5dc" },
            { brand: "Metz", count: 2, color: "#349d6b" },
            { brand: "CHiQ", count: 1, color: "#f37b43" },
            { brand: "Devanti", count: 1, color: "#905aa6" },
            { brand: "Furrion", count: 1, color: "#e573b9" },
            { brand: "Hitachi", count: 1, color: "#4e67c8" },
            { brand: "Sansui", count: 1, color: "#8cc665" }
        ];

        var width2 = 560;
        var height2 = 360;
        var margin = { top: 25, right: 15, bottom: 95, left: 45 };

        var svgBar = d3.select("#d3-bar-chart")
            .append("svg")
            .attr("viewBox", "0 0 " + width2 + " " + height2)
            .style("width", "100%")
            .style("height", "auto");

        var x = d3.scaleBand()
            .domain(barData.map(function(d) { return d.brand; }))
            .range([margin.left, width2 - margin.right])
            .padding(0.18);

        var y = d3.scaleLinear()
            .domain([0, 60])
            .range([height2 - margin.bottom, margin.top]);

        svgBar.append("g")
            .attr("transform", "translate(0," + (height2 - margin.bottom) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-55)")
            .style("text-anchor", "end")
            .style("font-size", "8.5px")
            .style("font-weight", "bold");

        svgBar.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(d3.axisLeft(y).ticks(6));

        svgBar.selectAll(".bar")
            .data(barData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.brand); })
            .attr("y", function(d) { return y(d.count); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height2 - margin.bottom - y(d.count); })
            .attr("fill", function(d) { return d.color; })
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("opacity", 0.7).attr("stroke", "#333").attr("stroke-width", 1.2);
                tooltip.style("opacity", 1)
                       .html(d.brand + ": " + d.count + " models")
                       .style("left", (event.pageX + 12) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("opacity", 1).attr("stroke", "none");
                tooltip.style("opacity", 0);
            });

        svgBar.selectAll(".bar-label")
            .data(barData)
            .enter()
            .append("text")
            .attr("x", function(d) { return x(d.brand) + (x.bandwidth() / 2); })
            .attr("y", function(d) { return y(d.count) - 4; })
            .attr("text-anchor", "middle")
            .style("font-size", "7.5px")
            .style("font-weight", "bold")
            .style("fill", "#333")
            .text(function(d) { return d.count; });
    }
}