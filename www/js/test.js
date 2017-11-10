var indicator = $("#indicator :selected").text(); // The text content of the selected option
var currentContinent = null;

window.onload = function() {
  d3.selectAll("svg").remove();
  draw(indicator, currentContinent);
}

function reloadInd(){
  d3.selectAll("svg").remove();
  indicator = $("#indicator :selected").text();
  draw(indicator, currentContinent);
}

function compare(){
  if(!comparing){
    comparing = true;
  } else{
    comparing = false;
  }
    //document.getElementById('ind2').style.display = "block";
    indicator = $("#indicator :selected").text();
    draw(indicator, currentContinent);
  }

  function draw(ind, continent){
    console.log(continent);
    var margin = {top: 30, right: 190, bottom: 100, left: 250},
    margin2 = { top: 10, right: 20, bottom: 20, left: 40 },
    width = 1450 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

//var parseDate = d3.time.format("%Y%m%d").parse;
var bisectDate = d3.bisector(function(d) { return d.Time; }).left;

var xScale = d3.scale.linear()
.range([0, width]),

xScale2 = d3.scale.linear()
    .range([0, width]); // Duplicate xScale for brushing ref later

    var yScale = d3.scale.linear()
    .range([height, 0]);

// 40 Custom DDV colors 
var color = d3.scale.ordinal().range(
  ["#48A36D",  "#56AE7C",  "#64B98C", "#72C39B", "#80CEAA", "#80CCB3", "#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", 
  "#7FB1CF", "#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD", "#9E81CC", "#AA81C5", "#B681BE", "#C280B7",
  "#CE80B0", "#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167", "#E26962", "#E2705C", "#E37756", "#E38457", 
  "#E39158", "#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E", "#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A"]);  


var xAxis = d3.svg.axis()
.scale(xScale)
.orient("bottom"),

    xAxis2 = d3.svg.axis() // xAxis for brush slider
    .scale(xScale2)
    .orient("bottom");    

    var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");  

    // var line = d3.svg.line()
    // .interpolate("basis")
    // .x(function(d) { return xScale(d.date[0]); })
    // .y(function(d) { return yScale(d.rating[0]); });
    //.defined(function(d) { return d.Value; });  // Hiding line value defaults of 0 for missing data

    var line = function(x, y){
      return d3.svg.line().interpolate("basis")
      .x(function(d,i) { return xScale(x[i]); })
      .y(function(d,i) { return yScale(y[i]); })
      (Array(x.length));;
    }

var maxY; // Defined later to update yAxis

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
svg.append("rect")
.attr("width", width)
.attr("height", height)                                    
.attr("x", 0) 
.attr("y", 0)
.attr("id", "mouse-tracker")
.style("fill", "white"); 


var a = ["Afghanistan", "Armenia", "Azerbaijan", "Bangladesh", "Bhutan", "Brunei Darussalam", "Cambodia", "China", "Democratic People's Republic of Korea", "Egypt", 
"India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kyrgyzstan", "Lebanon", 
"Malaysia", "Mongolia",  "Myanmar", "Nepal", "Pakistan", "Papua New Guinea", "Philippines", "Qatar", "Republic of Korea", "Russian Federation", 
"Saudi Arabia", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Turkmenistan", "Thailand", "United Arab Emirates", "Uzbekistan",  "Viet Nam", "Yemen" ];
var aus = ["Australia", "Cook Islands", "Fiji", "Honduras", "Kiribati", "Marshall Islands", "Nauru", "New Zealand", "Niue", "Palau",
"Samoa", "Solomon Islands", "Tokelau", "Tonga", "Tuvalu", "Vanuatu"];
var nAm = ["Barbados", "Bermuda", "Canada", "Dominica", "Puerto Rico",  "Saint Lucia", "United States of America"];
var sAm =["Argentina", "Bahamas", "Brazil", "Belize", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominica", "Ecuador", "El Salvador", "Guatemala", 
"Guyana", "Haiti", "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Suriname"];
var eur = ["Albania", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", 
"France", "Georgia", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Lithuania", "Luxembourg", "Montenegro", 
"Moldova", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Slovakia", "Slovenia", "Spain", "Sweden",  "Switzerland", 
"Turkey", "United Kingdom", "Ukraine"];
var afr = ["Angola", "Benin", "Botswana", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo",
 "Gabon", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Mozambique", 
 "Namibia", "Niger", "Rwanda", "Senegal", "Seychelles", "Sudan", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"];

var continents = ["Asia", "Oceania", "North America", "South America", "Europe", "Africa"];


d3.csv("data/edu.csv", function(error, data) { 

  var contLegendSpace = 50;

  var columnNames;//grab the key values from your first data row

  var texts = svg.selectAll("text")
  .data(continents)
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
  .enter();

  texts.append("text")
    .attr("x", -80)
    .attr("y", 600)
    .attr("dy", "1em")
    .style("font", "10px avenir")
    .style("fill", "#898686")
    .text("Close top graph [X]")
    .on("mouseover", function(d){
        svg.append("text")
        .style("fill", "#797979");
    })
    .on("mouseout", function(d){
        svg.append("text")
        .style("fill", "#898686");
    })
    .on("click", function(d){
        //d3.select(this.parentNode).remove();
        d3.select("svg").remove();
            });

  texts.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle") 
        .attr("font-family", "avenir") 
        .style("font-size", "16px") 
        .text(ind);

  texts.append("text")
  .text(function(d){ return d; })
       // set position etc.
       .attr("font-family", "avenir")
       .attr("font-size", 18)
       .attr("text-anchor", "start")
       .attr("x", width + (margin.right/10)) 
       .attr("y", function (d, i) { 
        if(d == "Asia") {
         return (50);
       }
       else if (d == "North America"){
        return (95) + (i*95);
      }
      else if (d == "South America"){
        return (106) + (i*106);
      }
      else if (d == "Europe"){
        return (101) + (i*101);
      }
      else if (d == "Africa"){
        return (97) + (i*97);
      }
      else if (d = "Oceania") {
        return (71) + (i*71);
      }
    }) 
       .attr("dy", ".33em")
       .attr("style", "fill:#7FB1CF; writing-mode: tb; glyph-orientation-vertical: 0")
       .style("text-anchor", "end")
       .on("click", function(d){
        if(d == "Asia") {
         d3.select("svg").remove();
         currentContinent = "Asia";
         draw(ind, currentContinent);
         console.log("asia clicked");

       }
       else if (d == "North America"){
        d3.select("svg").remove();
        currentContinent = "North America";
        draw(ind, currentContinent);
        console.log("NA clicked");
      }
      else if (d == "South America"){
        d3.select("svg").remove();
        currentContinent = "South America";
        draw(ind, currentContinent);
        console.log("SA clicked");
      }
      else if (d == "Europe"){
        d3.select("svg").remove();
        currentContinent = "Europe";
        draw(ind, currentContinent);
        console.log("europe clicked");
      }
      else if (d == "Africa"){
        d3.select("svg").remove();
        currentContinent = "Africa";
        draw(ind, currentContinent);
        console.log("africa clicked");
      }
      else if (d == "Oceania") {
        d3.select("svg").remove();
        currentContinent = "Oceania";
        draw(ind, currentContinent);
        console.log("oceania clicked");
      }
    });


       if(currentContinent == "Asia"){
        columnNames = a;
      } else if(currentContinent == "Oceania"){
        columnNames = aus;
      }else if(currentContinent == "North America"){
        columnNames = nAm;
      }else if(currentContinent == "South America"){
        columnNames = sAm;
      }else if(currentContinent == "Europe"){
        columnNames = eur;
      }else if(currentContinent == "Africa"){
        columnNames = afr;
      } else if (currentContinent == null) {
       columnNames = ["Argentina", "Australia", "Canada", "Chile", "China", "Costa Rica", "Denmark", "Egypt", "Fiji", "Finland", "France", "Ghana", 
"Iceland", "India", "Indonesia", "Israel", "Japan", "Malaysia", "Mexico", "Mongolia", "Morocco", "Myanmar", "New Zealand", 
"Nigeria", "Norway", "Oman", "Paraguay", "Peru", "Philippines", "Qatar", "Russian Federation",  
"Saudi Arabia", "Senegal", "Slovakia", "South Africa", "Sudan", "Sweden", "Thailand", "Turkey", "Yemen"]; 
     }

  color.domain(columnNames);//.filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
  //   return key !== "date"; 
  // }));

  num = 40;
  var filtered = data.filter(function(d) {
   for(i = 0; i < columnNames.length; i++){
    if(d.Indicator == indicator  && d.Country == columnNames[i]){
      return d;
    }
  }
})

  filtered.forEach(function(d) { // Make every date in the csv data a javascript date object format
    d["TIME"] = d["TIME"];
    d.Value = +d.Value;
  });
  
  var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys

    return {
       name: name, // "name": the csv headers except date
       date:  filtered.map(function(d) { // "values": which has an array of the dates and ratings
        if(d.Country == name){
          return d["TIME"];
        }
      }),
      rating:  filtered.map(function(d) { // "values": which has an array of the dates and ratings
        if(d.Country == name){
          return d.Value;
        }
      }),   
      visible: false//(name === "Philippines" ? true : false)
    };
  });
  for(i = 0; i < columnNames.length; i++){
    categories[i].rating = categories[i].rating.filter(Boolean);
    categories[i].date = categories[i].date.filter(Boolean);
  }

  function search(nameKey, categories){
    for (var i=0; i < categories.length; i++) {
      if (categories[i].name === nameKey) {
        return categories[i];
      }
    }
  }

  console.log(categories);

  xScale.domain(d3.extent(filtered, function(d) { return d.Time; })); // extent = highest and lowest points, domain is data, range is bouding box

  yScale.domain([0, d3.max(categories, function(c) { return d3.max(c.rating, function(v,i) { return v.rating; }); })]);

  xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later

  // draw line graph
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis.tickFormat(d3.format("d")));

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("x", -10)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Enrolled Population");



  var issue = svg.selectAll(".issue")
      .data(categories) // Select nested data and append to new svg group elements
      .enter().append("g")
      .attr("class", "issue");   

      issue.append("path")
      .attr("class", "line")
      .style("pointer-events", "none") // Stop line interferring with cursor
      .attr("id", function(d) {
        return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
      })
      .attr("d", function(d) { 
        return d.visible ? line(d.date, d.rating) : null; // If array key "visible" = true then draw line, if not then don't 
      })
      .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
      .style("stroke", function(d) { return color(d.name); });


    //  svg.selectAll(".dot")
    // .data(categories)
    // .enter().append("circle")
    // .attr("class", "dot")
    // .attr("r", 4)
    // .attr("cx", function(d,i) { return (xScale[i]);})
    // .attr("cy",  function(d,i) { return (yScale[i]);})
    // .style("fill", function(d) { return color(d.name);}) 
    // .on("mouseover", function(d) {
    //   tooltip.transition()
    //   .duration(200)
    //   .style("opacity", .9);
    //   tooltip.html(d["Country"] + "<br/> (" + xValue(d) 
    //     + ", " + yValue(d) + ")")
    //   .style("left", (d3.event.pageX + 5) + "px")
    //   .style("top", (d3.event.pageY - 28) + "px");
    // })
    // .on("mouseout", function(d) {
    //   tooltip.transition()
    //   .duration(500)
    //   .style("opacity", 0);
    // });


  // draw legend
  var legendSpace = 15;//450 / categories.length; // 450/number of issues (ex. 40)    

  issue.append("rect")
  .attr("width", 10)
  .attr("height", 10)                                    
  .attr("x", width + (margin.right/3) - 15) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
      .attr("fill",function(d) {
        return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey 
      })
      .attr("class", "legend-box")

      .on("click", function(d){ // On click make d.visible 
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true
        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        svg.select(".y.axis")
        .transition()
        .call(yAxis);   

        issue.select("path")
        .transition()
        .attr("d", function(d){
            return d.visible ? line(d.date, d.rating) : null; // If d.visible is true then draw line for this d selection
          })

        issue.select("rect")
        .transition()
        .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";
        });
      })

      .on("mouseover", function(d){

        d3.select(this)
        .transition()
        .attr("fill", function(d) { return color(d.name); });

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
        .transition()
        .style("stroke-width", 2.5);  
      })

      .on("mouseout", function(d){

        d3.select(this)
        .transition()
        .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";});

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
        .transition()
        .style("stroke-width", 1.5);
      })
      
      issue.append("text")
      .attr("id", "txttool")
      .attr("x", width + (margin.right/3)) 
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625) 
      .text(function(d) { return d.name; }); 

  // Hover line 
  var hoverLineGroup = svg.append("g") 
  .attr("class", "hover-line");

  var hoverLine = hoverLineGroup // Create line with basic attributes
  .append("line")
  .attr("id", "hover-line")
  .attr("x1", 10).attr("x2", 10) 
  .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none") // Stop line interferring with cursor
            .style("opacity", 1e-6); // Set opacity to zero 

            var hoverDate = hoverLineGroup
            .append('text')
            .attr("class", "hover-text")
            .attr("y", height - (height-40)) // hover date text position
            .attr("x", width - 150) // hover date text position
            .style("fill", "#E6E7E8");

            // var columnNames =["Qatar", "Israel", "China", "Canada", "New Zealand", "Japan", "Sudan", "Thailand", "Mongolia", "Mexico", 
            // "Australia", "Argetina", "Egypt", "Sweden", "Morocco", "Peru", "Iceland", "Norway", "Yemen", "Nigeria",
            // "Finland", "Senegal", "Fiji", "South Africa", "Turkey", "India", "Myanmar", "Chile", "Russian Federation", "Denmark",
            //                 "Costa Rica", "France", "Oman", "Indonesia", "Malaysia", "Ghana", "Slovakia", "Paraguay", "Saudi Arabia", "Philippines"]; //grab the key values from your first data row
            //                          //these are the same as your column names
                  //.slice(1); //remove the first column name (`date`);

  var focus = issue.select("g") // create group elements to house tooltip text
      .data(columnNames) // bind each column name date to each g element
    .enter().append("g") //create one <g> for each columnName
    .attr("class", "focus"); 

  focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
  .attr("class", "tooltip")
        .attr("x", width + 20) // position tooltips  
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips  



  // Add mouseover events for hover line.
  d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
  .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
  .on("mouseout", function() {
    hoverDate
          .text(null) // on mouseout remove text for hover date

          d3.select("#hover-line")
          .style("opacity", 1e-6); // On mouse out making line invisible
        });

  function mousemove() { 
      var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
      var graph_x = xScale.invert(mouse_x); // 

      //var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
      //var graph_y = yScale.invert(mouse_y);
      //console.log(graph_x);
      
      var format = d3.time.format('d'); // Format hover date text to show three letter month and full year
      
      hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year
      
      d3.select("#hover-line") // select hover-line and changing attributes to mouse position
      .attr("x1", mouse_x) 
      .attr("x2", mouse_x)
          .style("opacity", 1); // Making line visible

      // Legend tooltips // http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

      var x0 = xScale.invert(d3.mouse(this)[0]), /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
      i = bisectDate(filtered, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
      /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
      d0 = filtered[i - 1],
      d1 = filtered[i],
      /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/

      //d is now the data row for the date closest to the mouse position

      focus.select("text").text(function(columnName){
         //because you didn't explictly set any data on the <text>
         //elements, each one inherits the data from the focus <g>

         return (d[columnName]);
       });
    }; 
}); // End Data callback function
}
function findMaxY(data){  // Define function "findMaxY"
var maxYValues = data.map(function(d) { 
  if (d.visible){
    return d3.max(d.rating);
        // d.values, function(value) { // Return max rating value
        //   return value.rating; })
      }
    });
return d3.max(maxYValues);
}

// var isAsia = false,
// isAus = false,
// isNA  = false,
// isSA = false, 
// isEur = false,
// isAfr = false; 

var comparing = false; 

// function asia(){
//   isAsia = true;
//   isAus = false,
//   isNA  = false,
//   isSA = false, 
//   isEur = false,
//   isAfr = false; 
//   console.log(isAsia, isAus, isNA, isSA, isEur, isAfr);
//   d3.selectAll("svg").remove();

//   draw(indicator);
// }

// function australia(){
//   isAus = true;
//   isAsia = false,
//   isNA  = false,
//   isSA = false, 
//   isEur = false,
//   isAfr = false; 

//   console.log(isAsia, isAus, isNA, isSA, isEur, isAfr);
//   d3.selectAll("svg").remove();

//   draw(indicator);
// }

// function nAmerica(){
//   isNA = true;
//   isAsia = false,
//   isAus = false,
//   isSA = false, 
//   isEur = false,
//   isAfr = false; 

//   console.log(isAsia, isAus, isNA, isSA, isEur, isAfr);
//   d3.selectAll("svg").remove();

//   draw(indicator);
// }

// function sAmerica(){
//   isSA = true;
//   isAsia = false,
//   isAus = false,
//   isNA  = false,
//   isEur = false,
//   isAfr = false; 

//   console.log(isAsia, isAus, isNA, isSA, isEur, isAfr);
//   d3.selectAll("svg").remove();

//   draw(indicator);
// }

// function europe(){
//   isEur = true;
//   isAsia = false,
//   isAus = false,
//   isNA  = false,
//   isSA = false, 
//   isAfr = false; 

//   console.log(isAsia, isAus, isNA, isSA, isEur, isAfr);
//   d3.selectAll("svg").remove();

//   draw(indicator);
// }

// function africa(){
//   isAfr = true;
//   isAsia = false,
//   isAus = false,
//   isNA  = false,
//   isSA = false, 
//   isEur = false;
//   console.log(isAsia, isAus, isNA, isSA, isEur, isAfr);
//   d3.selectAll("svg").remove();
//   draw(indicator);
// }
