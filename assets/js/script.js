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
        var watts = parseFloat(document.getElementById("wattage").value);
        var hours = parseFloat(document.getElementById("hours").value);
        var price = parseFloat(document.getElementById("price").value);

        if (watts > 0 && hours > 0 && price > 0) {
            document.getElementById("calc-error").style.display = "none";
            
            var dailyKWh = (watts * hours) / 1000;
            var monthlyKWh = dailyKWh * 30;
            var monthlyCost = (monthlyKWh * price) / 100;
            var yearlyCost = monthlyCost * 12;

            document.getElementById("res-daily").innerHTML = dailyKWh.toFixed(2);
            document.getElementById("res-monthly").innerHTML = monthlyKWh.toFixed(2);
            document.getElementById("res-cost").innerHTML = monthlyCost.toFixed(2);
            if (document.getElementById("res-yearly")) {
                document.getElementById("res-yearly").innerHTML = yearlyCost.toFixed(2);
            }
            
            document.getElementById("calc-results").style.display = "block";
        } else {
            document.getElementById("calc-error").style.display = "block";
            document.getElementById("calc-results").style.display = "none";
        }
    };
}

// =============================================================
// 3. INTERACTIVE CHARTS (UPDATED FROM ASM1 FIXED CSV)
// =============================================================

if (typeof d3 !== "undefined") {
    var tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "#1e293b")
        .style("color", "#fff")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "13px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("box-shadow", "0 4px 12px rgba(0,0,0,0.25)")
        .style("z-index", "9999")
        .style("opacity", 0);

    // --- HOME PAGE CHART: HOUSEHOLD APPLIANCE COMPARISON ---
    if (document.getElementById("home-appliance-chart")) {
        var homeData = [
            { item: "Heating & Cooling", kwh: 1850, color: "#ff007f" },
            { item: "Refrigerator", kwh: 520, color: "#008b8b" },
            { item: "Clothes Dryer", kwh: 450, color: "#4e67c8" },
            { item: "Large 75\"+ TV", kwh: 380, color: "#f37b43" },
            { item: "Medium 55\" TV", kwh: 210, color: "#349d6b" },
            { item: "Small 32\" TV", kwh: 95, color: "#8cc665" }
        ];

        var wHome = 460, hHome = 260;
        var mHome = { top: 15, right: 55, bottom: 35, left: 115 };

        var svgHome = d3.select("#home-appliance-chart")
            .append("svg")
            .attr("viewBox", "0 0 " + wHome + " " + hHome)
            .style("width", "100%")
            .style("height", "auto");

        var xHome = d3.scaleLinear().domain([0, 2100]).range([mHome.left, wHome - mHome.right]);
        var yHome = d3.scaleBand().domain(homeData.map(function(d) { return d.item; })).range([mHome.top, hHome - mHome.bottom]).padding(0.28);

        svgHome.append("g").attr("transform", "translate(0," + (hHome - mHome.bottom) + ")").call(d3.axisBottom(xHome).ticks(5));
        svgHome.append("g").attr("transform", "translate(" + mHome.left + ",0)").call(d3.axisLeft(yHome)).selectAll("text").style("font-weight", "bold").style("font-size", "10.5px");

        svgHome.selectAll(".hbar").data(homeData).enter().append("rect").attr("x", mHome.left).attr("y", function(d) { return yHome(d.item); }).attr("width", function(d) { return xHome(d.kwh) - mHome.left; }).attr("height", yHome.bandwidth()).attr("fill", function(d) { return d.color; }).attr("rx", 4)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("opacity", 0.75);
                tooltip.style("opacity", 1).html(d.item + ": ~" + d.kwh + " kWh/year").style("left", (event.pageX + 12) + "px").style("top", (event.pageY - 28) + "px");
            }).on("mouseout", function() {
                d3.select(this).attr("opacity", 1);
                tooltip.style("opacity", 0);
            });

        svgHome.selectAll(".hlabel").data(homeData).enter().append("text").attr("x", function(d) { return xHome(d.kwh) + 6; }).attr("y", function(d) { return yHome(d.item) + (yHome.bandwidth() / 2) + 4; }).style("font-size", "10px").style("font-weight", "bold").style("fill", "#333").text(function(d) { return d.kwh + " kWh"; });
    }

    // --- TELEVISIONS PAGE CHART 1: PIE CHART ---
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
            { brand: "Other", count: 66, color: "#7ec850" }
        ];

        var totalModels = d3.sum(pieData, function(d) { return d.count; });
        var width1 = 440, height1 = 310, radius = 110;

        var svgPie = d3.select("#d3-pie-chart").append("svg").attr("viewBox", "0 0 " + width1 + " " + height1).style("width", "100%").style("height", "auto").append("g").attr("transform", "translate(" + (width1 / 2) + "," + (height1 / 2) + ")");
        var pie = d3.pie().sort(null).value(function(d) { return d.count; });
        var arc = d3.arc().innerRadius(28).outerRadius(radius);
        var arcHover = d3.arc().innerRadius(28).outerRadius(radius + 10);
        var labelArc = d3.arc().innerRadius(radius + 22).outerRadius(radius + 22);

        svgPie.selectAll("path").data(pie(pieData)).enter().append("path").attr("d", arc).attr("fill", function(d) { return d.data.color; }).attr("stroke", "#fff").style("stroke-width", "2px").style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                var pct = ((d.data.count / totalModels) * 100).toFixed(1);
                d3.select(this).transition().duration(150).attr("d", arcHover);
                tooltip.style("opacity", 1).html(d.data.brand + ": " + d.data.count + " models (" + pct + "%)").style("left", (event.pageX + 12) + "px").style("top", (event.pageY - 28) + "px");
            }).on("mouseout", function() {
                d3.select(this).transition().duration(150).attr("d", arc);
                tooltip.style("opacity", 0);
            });

        svgPie.selectAll("text").data(pie(pieData)).enter().append("text").attr("transform", function(d) { var c = labelArc.centroid(d); return "translate(" + c[0] + "," + c[1] + ")"; }).attr("text-anchor", "middle").style("font-size", "9.5px").style("font-weight", "bold").style("fill", "#333").text(function(d) { return d.data.brand; });

        var legendContainer = d3.select("#pie-legend");
        if (!legendContainer.empty()) {
            pieData.forEach(function(item) {
                var div = legendContainer.append("div").attr("class", "legend-item");
                div.append("span").attr("class", "legend-color").style("background-color", item.color);
                div.append("span").text(item.brand + " (" + item.count + ")");
            });
        }
    }

    // --- TELEVISIONS PAGE CHART 2: BAR CHART (33 BARS FROM FIXED CSV) ---
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
            { brand: "Hubbl Glass", count: 2, color: "#eb6559" },
            { brand: "TENET", count: 2, color: "#68b5dc" },
            { brand: "yokohama", count: 2, color: "#349d6b" },
            { brand: "Hubbl", count: 1, color: "#f37b43" },
            { brand: "LSP TV", count: 1, color: "#905aa6" },
            { brand: "Palsonic", count: 1, color: "#e573b9" },
            { brand: "Polaroid", count: 1, color: "#4e67c8" },
            { brand: "SONIQ", count: 1, color: "#8cc665" },
            { brand: "SVISION", count: 1, color: "#f7c852" },
            { brand: "Stan Cash", count: 1, color: "#eb6559" },
            { brand: "WINTAL", count: 1, color: "#68b5dc" },
            { brand: "Yokohama", count: 1, color: "#349d6b" }
        ];

        var width2 = 620, height2 = 360;
        var margin = { top: 25, right: 15, bottom: 95, left: 45 };

        var svgBar = d3.select("#d3-bar-chart").append("svg").attr("viewBox", "0 0 " + width2 + " " + height2).style("width", "100%").style("height", "auto");
        var x = d3.scaleBand().domain(barData.map(function(d) { return d.brand; })).range([margin.left, width2 - margin.right]).padding(0.18);
        var y = d3.scaleLinear().domain([0, 60]).range([height2 - margin.bottom, margin.top]);

        svgBar.append("g").attr("transform", "translate(0," + (height2 - margin.bottom) + ")").call(d3.axisBottom(x)).selectAll("text").attr("transform", "rotate(-55)").style("text-anchor", "end").style("font-size", "7.5px").style("font-weight", "bold");
        svgBar.append("g").attr("transform", "translate(" + margin.left + ",0)").call(d3.axisLeft(y).ticks(6));

        svgBar.selectAll(".bar").data(barData).enter().append("rect").attr("class", "bar").attr("x", function(d) { return x(d.brand); }).attr("y", function(d) { return y(d.count); }).attr("width", x.bandwidth()).attr("height", function(d) { return height2 - margin.bottom - y(d.count); }).attr("fill", function(d) { return d.color; }).attr("rx", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("opacity", 0.7).attr("stroke", "#333").attr("stroke-width", 1.2);
                tooltip.style("opacity", 1).html(d.brand + ": " + d.count + " models").style("left", (event.pageX + 12) + "px").style("top", (event.pageY - 28) + "px");
            }).on("mouseout", function() {
                d3.select(this).attr("opacity", 1).attr("stroke", "none");
                tooltip.style("opacity", 0);
            });

        svgBar.selectAll(".bar-label").data(barData).enter().append("text").attr("x", function(d) { return x(d.brand) + (x.bandwidth() / 2); }).attr("y", function(d) { return y(d.count) - 4; }).attr("text-anchor", "middle").style("font-size", "7px").style("font-weight", "bold").style("fill", "#333").text(function(d) { return d.count; });
    }
}