var svgWidth = 980;
var svgHeight = 600;

var margin = {
    top: 50,
    bottom: 70,
    right: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV
d3.csv("../assets/data/data.csv").then(function (healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function (data) {
        data.age = +data.poverty;
        data.smokes = +data.smokes;
        data.abbr = data.abbr;
    });
    console.log()


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([22, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([9, d3.max(healthData, d => d.smokes)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale).ticks(14);
    var yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "orange")
        .attr("opacity", ".5");
   
    //Append text into circles
    chartGroup.append("g")
        .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.smokes))
        .attr('font-size', 11)//font size
        .attr('dx', -7)//positions text towards the left of the center of the circle
        .attr('dy', 4)
        .style('fill', 'black');

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([0, -4])
        .html(function (d) {
            return (`${d.state}<br>Smokers: ${d.smokes}%<br>Poverty (%): ${d.poverty}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Step 9: Create axes labels
    //  ==============================
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
}).catch(function (error) {
    console.log(error);
});