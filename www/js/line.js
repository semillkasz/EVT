  

window.onload = function() {
  // var svg = d3.select("body").append("svg").attr("width","1100").attr("height", "500"),
  // inner = svg.append("g");
  var indicator = $("#indicator :selected").text(); // The text content of the selected option
  var country = $("#country :selected").text(); // The text content of the selected option
  
  country = "New Zealand";

  var first, second, third, fourth, fifth;
  console.log(indicator);
  console.log(country);
  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 30, bottom: 30, left: 300};
  var   width = 1100 - margin.left - margin.right;
  var   height = 500 - margin.top - margin.bottom;

  // parse the date / time
  //var parseTime = d3.timeParse("%d-%b-%y");

  // set the ranges
  var x = d3.scale.linear().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // define the line
  var valueline = d3.svg.line()
  .x(function(d) { return x(d.Time); })
  .y(function(d) { return y(d.Value); });

  var xValue = function(d) { return d.Time;},
  xMap = function(d) { return x(xValue(d));},
  yValue = function(d) { return d.Value;},
  yMap = function(d) { return y(yValue(d));};

  // setup fill color
  var cValue = function(d) { return d.Country;},
  color = d3.scale.ordinal(d3.schemeCategory10);

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv("data/edu.csv", function(error, data) {

    if (error) throw error;

    data = data.filter(function(d) {
      return d["Country"] == country &&
      d["Indicator"] == indicator;
    })
    // format the data
    data.forEach(function(d) {
      d["TIME"] = d["TIME"];
      d.Value = +d.Value;
    });
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { console.log(d.Time);return d.Time;  }));
    y.domain([0, d3.max(data, function(d) { console.log(d.Value);return d.Value; })]);

    // Add the valueline path.
    svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);


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


    // Add the X Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.svg.axis()
      .scale(x)
      .orient("bottom").tickFormat(d3.format("d")));

    // Add the Y Axis
    svg.append("g")
    .call(d3.svg.axis()
      .scale(y)
      .orient("left"));

  });
}



