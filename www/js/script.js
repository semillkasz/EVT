// ps -fA | grep python
// python -m SimpleHTTPServer

// d3.csv("data/pre-primary-both.csv", function(data){
// 	console.log(data[0]);
// 	var female2ndData = data.filter(function(d) { 
//     	if(d["Indicator"] == "Enrolment in lower secondary education, female (number)"){ 
//         	return d;
// 	    } 
// 	})
// 	console.log(female2ndData);
// 	var both2ndData = data.filter(function(d) { 
//     	if(d["Indicator"] == "Enrolment in upper secondary education, both sexes (number)"){ 
//         	return d;
// 	    } 
// 	})
// 	var p = d3.select("body")
// 			.selectAll("p")
// 			.data(data)
// 			.enter()
// 				.append("p")
// 				.text(function (d){
// 					return d.Value;
// 				});
// })

var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 1150 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */ 

// setup x 
var xValue = function(d) { return d.Value;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup y
var yValue = function(d) { return d.Time;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format("d"));

// setup fill color
var cValue = function(d) { return d.Country;},
color = d3.scaleOrdinal(d3.schemeCategory10);

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var valueline = d3.line()
.x(function(d) { return x(d.Time); })
.y(function(d) { return y(d.Value); });
// load datas
d3.csv("data/edu.csv", function(error, data) {
  data = data.filter(function(d) {
    return d["Country"] == "Philippines" &&
    d["Indicator"] == "Population of the official age for pre-primary education, both sexes (number)";
  })
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Value = +d.Value;
    d.Time = +d.Time;
//    console.log(d);
});

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  svg.append("path")
  .data([data])
  .attr("class", "line")
  .attr("d", valueline);

  // x-axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Value");

  // y-axis
  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Year");

  // draw dots
  svg.selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .attr("r", 4)
  .attr("cx", xMap)
  .attr("cy", yMap)
  .style("fill", function(d) { return color(cValue(d));}) 
  .on("mouseover", function(d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", .9);
    tooltip.html(d["Country"] + "<br/> (" + xValue(d) 
     + ", " + yValue(d) + ")")
    .style("left", (d3.event.pageX + 5) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
    .duration(500)
    .style("opacity", 0);
  });

  // draw legend
  // var legend = svg.selectAll(".legend")
  //     .data(color.domain())
  //   .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // // draw legend colored rectangles
  // legend.append("rect")
  //     .attr("x", width - 10 )
  //     .attr("width", 10)
  //     .attr("height", 10)
  //     .style("fill", color);

  // // draw legend text
  // legend.append("text")
  //     .attr("x", width - 16 )
  //     .attr("y", 6)
  //     .attr("dy", ".25em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d;})
});



