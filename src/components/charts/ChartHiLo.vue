<template>
<div>
   <slot></slot>
 </div>
</template>

<script>

export default {
  name: 'chart-hi-lo',
  props: ['gData'],
  data () {
    return {
      shortName:'',
    }
  },
  mounted: function(){
    this.shortName=this.gData[0].name.split(" ")[0].toLowerCase();
    createChart(this.gData,this.shortName);
  }
}


//will look like:
//[{"high":386.6,"low":294.025,"today":351.41,"av50":331.973,"av200":336.807}]
//ie array with one item...could add multiples
var margin = { top: 15, right: 1, bottom: 0, left: 0},
    width = 260 - margin.left - margin.right,
    height = 30 - margin.top - margin.bottom;

function createChart(gData,shortName) {
	var min = d3.min(gData, function (d) { return +d.low; });
	var max = d3.max(gData, function (d) { return +d.high; });

    var formatFixed0 = d3.format(".0f");

	var xScale = d3.scale.linear()
	.domain([min, max])
	.range([margin.left, width + margin.left]);

	//var svg = d3.select("#hilochart-" + shortName)
    var svg = d3.select("#hilochart-" + shortName)
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

    //draw surrounding rectangle (which will represent low & high prices)
    svg.append("svg:rect")
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("height", height)
    .attr("width", width)
    .attr("stroke", "rgb(245,245,245)")//rgb(204,204,204)
    .attr("stroke-width", "1px")
    .attr("fill", "none")
    .attr("shape-rendering", "crispEdges");

    //draw rect price range higher than today
    svg.selectAll("today")
    .data(gData)
    .enter()
    .append("svg:rect")
    .attr("x", function(d){return xScale(+d.today)})
    .attr("y", margin.top+1)
    .attr("height", height -2)
    .attr("width", function(d){return margin.left+width-xScale(+d.today)-1;})
    .attr("stroke", "hsl(141, 71%, 90%)")
    .attr("stroke-width", "1px")
    .attr("fill","hsl(141, 71%, 90%)") //rgb(240,255,240)
    .attr("shape-rendering", "crispEdges");

    //draw rect price range lower than today
    svg.selectAll("today")
    .data(gData)
    .enter()
    .append("svg:rect")
    .attr("x", margin.left+1)
    .attr("y", margin.top+1)
    .attr("height", height -2)
    .attr("width", function(d){return width-((width+margin.left)-xScale(+d.today));})
    .attr("stroke", "hsl(348, 100%, 92%)")
    .attr("stroke-width", "1px")
    .attr("fill","hsl(348, 100%, 92%)")// rgb(255,240,240
    .attr("shape-rendering", "crispEdges");

    //draw todays price 'line' (actually a narrow rect)
    svg.selectAll("today")
    .data(gData)
    .enter()
    .append("svg:rect")
    .attr("x", function(d){return xScale(+d.today)})
    .attr("y", margin.top +1)
    .attr("height", height -1)
    .attr("width", "1px")
    .attr("stroke", "rgb(51,51,51)")
    .attr("stroke-width", "1px")
    .attr("shape-rendering", "crispEdges");


    //draw 50 day av 'line' (actually a narrow rect)
    svg.selectAll("dayav50")
    .data(gData)
    .enter()
    .append("svg:rect")
    .attr("x", function(d){return xScale(+d.av50)})
    .attr("y", margin.top +1)
    .attr("height", height -1)
    .attr("width", "1px")
    .attr("stroke", "rgb(153,153,255)")
    .attr("stroke-width", "1px")
    .attr("shape-rendering", "crispEdges");

    //draw 200 day av 'line' (actually a narrow rect)
    svg.selectAll("dayav200")
    .data(gData)
    .enter()
    .append("svg:rect")
    .attr("x", function(d){return xScale(+d.av200)})
    .attr("y", margin.top +1)
    .attr("height", height -1)
    .attr("width", "1px")
    .attr("stroke", "rgb(204,204,255)")
    .attr("stroke-width", "1px")
    .attr("shape-rendering", "crispEdges");

    //add low label
    svg.selectAll("lowlabel")
    .data(gData)
    .enter()
    .append("text")
    .attr("text-anchor", "start")
    .text(function(d) { return formatFixed0(d.low); })
    .attr("x", margin.left)
    .attr("y", margin.top-2)
    .attr("font-size", "10px")
    .attr("fill", "rgb(153,153,153)");

    //add hi label
    svg.selectAll("hilabel")
    .data(gData)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .text(function(d) { return formatFixed0(d.high); })
    .attr("x", margin.left + width)
    .attr("y", margin.top-2)
    .attr("font-size", "10px")
    .attr("fill", "rgb(153,153,153)");

    // //add today label
    // svg.selectAll("todaylabel")
    // .data(gData)
    // .enter()
    // .append("text")
    // .attr("text-anchor", "middle")
    // .text(function(d) { return formatFixed0(d.today); })
    // .attr("x", function(d){return xScale(+d.today)})
    // .attr("y", margin.top + height + 12)
    // .attr("font-size", "11px")
    // .attr("fill", "rgb(51,51,51)");

    ////add title
    //yAxisHeading = stockLineCht.append("text")
    //    .text(function () {
    //        return "Price";
    //    })
    //    .attr("text-anchor", "middle")
    //    .attr("transform", "translate(" + 10 + "," + fHeight / 2 + ") rotate(-90)")
    //    .attr("class", "axisHeading");



    // svg.append("text")
    // .attr("text-anchor", "middle")
    // .text("52-WK RANGE")
    // .attr("x", (margin.left+width+margin.right)/2)
    // .attr("y", margin.top-2)
    //     .attr("textLength", width/3) // set text length
    //     .attr("lengthAdjust", "spacing")
    //     .attr("font-size", "11px")
    //     .attr("fill", "rgb(51,51,51)");
    
}

</script>