var countries = ["Argentina", "Armenia", "Aruba", "Australia", "Austria", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belgium", 
"Belize", "Benin", "Bolivia", "Brazil", "Bulgaria", "Burkina Faso", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", 
"Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", 
"Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "French Polynesia", "Gabon", 
"Germany", "Ghana", "Greece", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "India", 
"Indonesia", "Iran", "Ireland", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kyrgyzstan", "Laos", "Latvia", "Lithuania", "Luxembourg", 
"Macao", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico",
"Micronesia (country)", "Mongolia", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", 
"Niger", "Nigeria", "Norway", "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Reunion", 
"Romania", "Russia", "Rwanda", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Singapore", "Slovakia", 
"Slovenia", "Solomon Islands", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", 
"Timor", "Togo", "Tonga", "Trinidad and Tobago", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Kingdom", "United States", "United States Virgin Islands", 
"Uruguay", "Uzbekistan", "Vanuatu", "Vietnam", "Zambia", "Zimbabwe"];

graphCounter = 0;

country = $("#country :selected").text();

var dCountries = document.getElementById("country");

function populateDropdown(){
    for(var i = 0; i < countries.length; i++) {
        var opt = countries[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dCountries.appendChild(el);
    }
}

window.onload = function() {
  graphCounter = 0;
  populateDropdown();
  country = "Argentina";
  draw();
}

function reloadCountry(){
    graphCounter++;
    country = $("#country :selected").text();
    draw();
}


function get_colors(n) {
    var colors = ["#8dd3c7","#ffffb3","#bebada","#fb9a99","#80b1d3"];

    return colors[ n % colors.length];
}

function draw(){
    // d3.selectAll("svg").remove();

    var margin = {top: 120, right: 230, bottom: 150, left: 200},
    width = 1400 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    var x = d3.scale.linear()
    .range([0, width]);

    var y = d3.scale.linear()
    .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5, "s");

    var area = d3.svg.area()
    .x(function(d) { return x(d.Year); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });


    var stack = d3.layout.stack()
    .values(function(d) { return d.values; });

    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("x", 0)
    .attr("y", -60)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Population breakdown by highest level of education achieved for those aged 15+ in " + country)
    .style("font", "20px avenir")
    .style("fill", "#000000");

    svg.append("text")
    .attr("x", 0)
    .attr("y", 402)
    .attr("dy", "0em")
    .style("font", "12px avenir")
    .style("fill", "#000000");

    svg.append("text")
    .attr("x", 0)
    .attr("y", 402)
    .attr("dy", "1em")
    .style("font", "12px avenir")
    .style("fill", "#000000");

    svg.append("text")
    .attr("x", 0)
    .attr("y", 402)
    .attr("dy", "3em")
    .style("font", "12px avenir")
    .style("fill", "#000000")
    .style("font-weight", "bold");

    svg.append("text")
    .attr("x", 1110)
    .attr("y", 450)
    .attr("dy", "1em")
    .style("font", "10px avenir")
    .style("fill", "#898686")
    .text("Close top graph [X]")
    .on("mouseover", function(d){
        d3.select(this)
        .style("fill", "#797979");
    })
    .on("mouseout", function(d){
        d3.select(this)
        .style("fill", "#898686");
    })
    .on("click", function(d){
        // d3.select(this.parentNode).remove();
        d3.select("svg").remove();
            });

    d3.csv("data/breakdown.csv", function(error, data) {

        data = data.filter(function(d){
          if(d["Entity"] == country){
            return d;
            }
        });


        color.domain(d3.keys(data[0]).filter(function(key) {return key !== "Year" && key !== "Entity"; }));

        data.forEach(function(d) {  
            d["Aged 0-14"] = +d["Aged 0-14"];
            d["No education"] = +d["No education"];
            d["Primary education"]= +d["Primary education"];
            d["Secondary education"]= +d["Secondary education"];
            d["Tertiary education"] = +d["Tertiary education"];
        }); 

        max = (d3.max(data, function(d){ return  d["Aged 0-14"];})) + 
                (d3.max(data, function(d){ return  d["No education"];})) + 
                (d3.max(data, function(d){ return  d["Primary education"];})) + 
                (d3.max(data, function(d){ return  d["Secondary education"];})) + 
                (d3.max(data, function(d){ return  d["Tertiary education"];}))
            ;

        console.log(d3.max(max));
        var browsers = stack(color.domain().map(function(name) {
            return {
              name: name,
              values: data.map(function(d) {
                return {Year: d.Year, y: d[name] * 1};
            })
          };
      }));

//   // Find the value of the hour with highest total value
var maxYearVal = d3.max(data, function(d){
    var vals = d3.keys(d).map(
      function(key){ 
        return (key !== "Year") ? d[key] : 0 });
    return d3.sum(vals);
});

//   // Set domains for axes
x.domain(d3.extent(data, function(d) { return d.Year; }));
y.domain([0, max]);

var browser = svg.selectAll(".browser")
.data(browsers)
.enter().append("g")
.attr("class", "browser");

browser.append("path")
.attr("class", "area")
.attr("d", function(d) { return area(d.values); })
.style("fill", function(d,i) { 
    return get_colors(i); });


browser.append("text")
.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
.attr("transform", function(d) { return "translate(" + x(d.value.Year) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
.attr("x", -6)
.attr("dy", "-0.882em")
.attr("transform", function(d) { return "translate(500," + y(d.value.y0 + d.value.y / 2) + ")"; }) 

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis).append("text")
.attr("x", 350)
.attr("y", 36)
.attr("fill", "#000")

svg.append("g")
.attr("class", "y axis")
.call(yAxis)
.append("text")
.attr("transform", "rotate(-90)")
.attr("x", -250)
.attr("y", -40)
.attr("dy", "0.3408em")
.attr("fill", "#000")

var legend = svg.selectAll(".legend")
.data(color.domain()).enter()
.append("g")
.attr("class","legend")
.attr("transform", "translate(" + (width +20) + "," + 0+ ")");

legend.append("rect")
.attr("x", 0) 
.attr("y", function(d, i) { return 20 * i; })
.attr("width", 10)
.attr("height", 10)
.style("fill", function(d, i) {
    return get_colors(i);}); 

legend.append("text")
.attr("x", 20) 
.attr("dy", "0.75em")
.attr("y", function(d, i) { return 20 * i; })
.text(function(d) {return d});

legend.append("text")
.attr("x",0) 
//      .attr("dy", "0.75em")
.attr("y",-10)
.text("Categories");


});

}