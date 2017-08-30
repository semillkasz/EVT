var indicator = $("#indicator :selected").text(); // The text content of the selected option
var year = $("#year :selected").text(); // The text content of the selected option

window.onload = function() {
  draw(indicator,year)
}

function reloadInd(){
  indicator = $("#indicator :selected").text();
  draw(indicator, this.year);
}

function reloadYr(yr){
  draw(this.indicator, yr.value);
}

function play(){
  indicator = $("#indicator :selected").text();
  year = 1999;
  for(i = year; i < 2017; i++){
    draw(indicator, i);
    console.log(indicator);
    console.log(i);
  }
}

function draw(ind, y) {
  d3.select("#canvas-svg").selectAll("svg").remove();
  var indicator = ind;
  var year = y;
  d3.csv("data/rates.csv", function(error, data) {
    if(error) { console.log(error); }
    var config = {"data0":"Country","data1":"Value","data2":"Population",
    "label0":"label 0","label1":"label 1","color0":"#f7fcb9","color1":"#31a354",
    "width":960,"height":960}
    
    var filteredData = data.filter(function(d){
      if(d["TIME"] == year && d.Indicator == indicator){
        return d;
      }
    });

    var width = config.width,
    height = config.height;
    
    var COLOR_COUNTS = 9;
    
    function Interpolate(start, end, steps, count) {
      var s = start,
      e = end,
      final = s + (((e - s) / steps) * count);
      return Math.floor(final);
    }
    
    function Color(_r, _g, _b) {
      var r, g, b;
      var setColors = function(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
      };

      setColors(_r, _g, _b);
      this.getColors = function() {
        var colors = {
          r: r,
          g: g,
          b: b
        };
        return colors;
      };
    }


    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
    
    function valueFormat(d) {
      return Math.round(d * 100) / 100 + "%";
    }
    
    var COLOR_FIRST = config.color0, COLOR_LAST = config.color1;
    
    var rgb = hexToRgb(COLOR_FIRST);
    
    var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
    
    rgb = hexToRgb(COLOR_LAST);
    var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
    
    var startColors = COLOR_START.getColors(),
    endColors = COLOR_END.getColors();
    
    // var colors = [];
    
    // for (var i = 0; i < COLOR_COUNTS; i++) {
    //   var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
    //   var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
    //   var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
    //   colors.push(new Color(r, g, b));
    // }
    
    var colors = [(new Color(247,252,240)), (new Color(224,243,219)), (new Color(204,235,197)),
    (new Color(168,221,181)), (new Color(123,204,196)), (new Color(78,179,211)),
    (new Color(43,140,190)), (new Color(8,104,172)), (new Color(8,64,129))];

    var MAP_KEY = config.data0;
    var MAP_VALUE = config.data1;
    var MAP_POP = config.data2;

    var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);
    
    var path = d3.geo.path()
    .projection(projection);
    var centered;
    
    var graticule = d3.geo.graticule();
    
    var svg = d3.select("#canvas-svg").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
    
    var valueHash = {};
    function calculatePercentage(p, d){
      return (d/p)*100;
    }

    // var popMap = [];
    // d3.csv("data/pop.csv", function(err, data){
    //   popMap = data.map(function(d) { return [ +d["Country Name"], +d["2009"] ]; });
    //   console.log(popMap)
    // });

    var quantize = d3.scale.quantize()
    .domain([0, 1.0])
    .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));
    
    quantize.domain([d3.min(filteredData, function(d){
      return (+d[MAP_VALUE]) }),
    d3.max(filteredData, function(d){
      return (+d[MAP_VALUE]) })]);

    //var percentage = calculatePercentage(d.Population, d.Value);
    function log10(val) {
      return Math.log(val);
    }
    

    filteredData.forEach(function(d) {
      //if(d["TIME"] == year && d.Indicator == indicator){
        valueHash[d[MAP_KEY]] = +d[MAP_VALUE];
            //valueHash[d[MAP_KEY]] = +(calculatePercentage(d.Population, d.Value));
            //d[MAP_POP] = +(calculatePercentage(d.Population, d.Value));
         // }
       });  

    d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/world-topo-min.json", function(error, world) {
      var countries = topojson.feature(world, world.objects.countries).features;

      svg.append("path")
      .datum(graticule)
      .attr("class", "choropleth")
      .attr("d", path);

      var g = svg.append("g");

      g.append("path")
      .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
      .attr("class", "equator")
      .attr("d", path);

      var country = g.selectAll(".country").data(countries);

      country.enter().insert("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("id", function(d,i) { return d.id; })
      .attr("title", function(d) { return d.properties.name; })
      .style("fill", function(d) {
        if (valueHash[d.properties.name]) {
          var c = quantize((valueHash[d.properties.name]));
          var color = colors[c].getColors();
          return "rgb(" + color.r + "," + color.g +
          "," + color.b + ")";
        } else {
          return "#ccc";
        }
      })

      .on("mousemove", function(d) {
        var html = "";

        html += "<div class=\"tooltip_kv\">";
        html += "<span class=\"tooltip_key\">";
        html += d.properties.name;
        html += "</span>";
        html += "<span class=\"tooltip_value\">";
        html += (valueHash[d.properties.name] ? valueFormat(valueHash[d.properties.name]) : "");
        html += "";
        html += "</span>";
        html += "</div>";

        $("#tooltip-container").html(html);
        $(this).attr("fill-opacity", "0.8");
        $("#tooltip-container").show();

        var coordinates = d3.mouse(this);

        var map_width = $('.choropleth')[0].getBoundingClientRect().width;

        if (d3.event.pageX < map_width / 2) {
          d3.select("#tooltip-container")
          .style("top", (d3.event.layerY + 15) + "px")
          .style("left", (d3.event.layerX + 15) + "px");
        } else {
          var tooltip_width = $("#tooltip-container").width();
          d3.select("#tooltip-container")
          .style("top", (d3.event.layerY + 15) + "px")
          .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
        }
      })
      .on("mouseout", function() {
        $(this).attr("fill-opacity", "1.0");
        $("#tooltip-container").hide();
      })
      .on("click", function(d){
        var x, y, k;

        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }
        g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

        g.transition()
        .duration(750)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
      });
      
      g.append("path")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
      
      svg.attr("height", config.height * 2.2 / 3);

      //legend stuff
      var dom = quantize.domain(),
      l = (dom[1] - dom[0])/quantize.range().length,
      breaks = d3.range(0, quantize.range().length).map(function(i) { return i * l; });

      var z = d3.scale.ordinal()
      .range(["#F7FCF0", "#E0F3DB", "#ccebc5", "#a8ddb5", "#7BCCC4", "#4EB3D3", "#2B8CBE", "#0868ac", "#084081"]);

      var margin = {top: 20, right: 100, bottom: 30, left: 40};

      var legendHolder = svg.append('g')
      // translate the holder to the right side of the graph
      .attr('transform', "translate(10,"+500+")")

      var legend = legendHolder.selectAll(".legend")
      .data(breaks)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", z);

      legend.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .attr("x", 60)
      .attr("y", 9.5)
      .attr("dy", ".33em")
      .style("text-anchor", "end")
      .text(function(d) { return valueFormat(d); });
    });

d3.select(self.frameElement).style("height", (height * 2.3 / 3) + "px");
});
}