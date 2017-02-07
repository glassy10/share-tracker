<template>

  <div id="chart-share-history">

    <div id="chart"></div>
    <div>
      <div class="control has-addons" >
        <a class="button is-info is-small is-active" @click="getPeriod(30)" id="btn-period-30">1m</a>
        <a class="button is-info is-small" @click="getPeriod(90)" id="btn-period-90">3m</a>
        <a class="button is-info is-small" @click="getPeriod(365)" id="btn-period-365">1y</a>
      </div>
    </div>

    
  </div>
</template>

<script>

import Constants from 'components/helpers/Constants'
import Dates from 'components/helpers/Dates'

export default {
  name: 'chart-share-history',
  components: {
    Constants,Dates
  },
  data () {
    return {
      symbol: this.$route.params.symbol,
      chartData:[],
      startDate:Dates.yh30DaysAgo, //default chart setting
      endDate: Dates.yhToday, //default chart setting
    }

  },
  methods: {
    getPeriod: function (days) {
      //remove active class from all buttons
      $("[id^=btn-period]").removeClass('is-active');
      //get id of button triggering 
      var target = event.target || event.srcElement;
      var id = "#" + target.id;
      //set active class on button
      $(id).addClass('is-active');
      this.startDate = Dates.yhDaysAgo(days);
      this.endDate = Dates.yhToday;
    },
    getDataAndDoChart: function(operation){
      var yqlHistory=getYql(this.symbol,this.startDate,this.endDate);
      this.$http.get(Constants.yahooBaseApi + yqlHistory + Constants.yahooFormat)
      .then(function(res){
        this.chartData = res.data.query.results.quote;
        operation === 'draw' ? drawChart(this.chartData) : updateChart(this.chartData);
      });
    }
  },
  computed: {
      twoYearsAgo:() => {return Dates.yhTwoYearsAgo},
      oneYearAgo: () => {return Dates.yhOneYearAgo},
      threeYearsAgo:() => {return Dates.yhThreeYearsAgo},

    
  },
  watch: {
    symbol: function() {
      this.getDataAndDoChart('update');
    },
    startDate: function() {
      this.getDataAndDoChart('update');
    },
    endDate: function() {
      this.getDataAndDoChart('update');
    }
  },
  mounted: function(){
    this.getDataAndDoChart('draw');
  }
}
function getYql(symbol,startDate,endDate) {
  return "select * from yahoo.finance.historicaldata where symbol = '" + symbol + "' and startDate = '" + startDate + "' and endDate = '" + endDate + "'";
}


var bottomPadding = 20, //was 0
leftPadding = 30,
topPadding = 0,//was 20
rightPadding = 40,
width = 375 - leftPadding-rightPadding,
height = width * .75,
fBarWidth = 1,
stockLineCht,
xScale, yScale,volScale,
y1Bars,
xAxis,yAxis,volAxis, yAxisGroup,volAxisGroup,
yAxisHeading,
xAxisLabels,
minDate,maxDate,minClose,maxClose,maxVol;


function drawChart(chartData) {
//var $container = $('#chart');
//var width = $container.width(),//400,
//height = width * .75;//300,
var gData = chartData.reverse();
  //var purchaseData;
  minDate = getDate(gData[0]);
  maxDate = getDate(gData[gData.length - 1]);
  minClose = d3.min(gData, function (d) { return +d.Close; });
  maxClose = d3.max(gData, function (d) { return +d.Close; });
  maxVol = d3.max(gData, function (d) { return +d.Volume });

  // == X SCALE ==
  xScale = d3.time.scale()
  .range([leftPadding, width + leftPadding]);
  // == Y SCALE ==
  yScale = d3.scale.linear()
  .rangeRound([height, topPadding]);
  // == VOLUME (R) SCALE ==
  volScale = d3.scale.linear()
  .rangeRound([height, (height / 2 + topPadding)]);

  //set up canvas
  stockLineCht = d3.select("#chart")
  .append("svg:svg")
// .attr("width", '100%')
//         .attr("height", '100%')
//         .attr('viewBox','0 0 '+Math.min(width,height) +' '+Math.min(width,height) )
//         .attr('preserveAspectRatio','xMinYMin')
//         .append("g")
//         .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");
.attr("width", width + leftPadding + rightPadding)
.attr("height", height + bottomPadding + topPadding);

  //=========================
  //add x-axis
  xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .ticks(5);
    //.tickFormat(d3.time.format("%b-%y"));

  //===============================
  //add y-axis
  yAxis = d3.svg.axis()
  .scale(yScale)
  .orient("left")
  .tickSize(-width, 0, 0)
  .ticks(6);

  //=========================
  //add r-axis
  volAxis = d3.svg.axis()
  .scale(volScale)
  .orient("right")
  //.tickSize(-width, 0, 0) //added
  .tickFormat(d3.format("s"))
  .ticks(3);
  //=========================
  volAxisGroup = stockLineCht.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + (leftPadding + width) + ",0)");
  //=========================

  xAxisLabels = stockLineCht.selectAll("text.xAxis");

  //yAxisHeading = stockLineCht.append("text")
  //    .text(function () {
  //        return "Price";
  //    })
  //    .attr("text-anchor", "middle")
  //    .attr("transform", "translate(" + 10 + "," + height / 2 + ") rotate(-90)")
  //    .attr("class", "axisHeading");
  //


  // high-low range area
  var area = d3.svg.area()
  .x0(function (d) {return xScale(getDate(d)); })
  .x1(function (d) {return xScale(getDate(d)); })
  .y0(function (d) {return yScale(+d.Low); })
  .y1(function (d) {return yScale(+d.High); });

  //Add close line
  var closeLine = d3.svg.line()
  .x(function (d) {return xScale(getDate(d));})
  .y(function (d) {return yScale(+d.Close);});

  xScale.domain([minDate, maxDate]);
  yScale.domain([(minClose - (minClose * 0.1)), maxClose * 1.1]);
  volScale.domain([0, maxVol]);

  //------------------------------
  // purchaseData = scope.purchasedata;
  // if (purchaseData) {
  //     stockLineCht.selectAll("dot")
  //         .data(purchaseData)
  //         .enter()
  //         .append("circle")
  //         .style("fill", "#ff0000")
  //         .attr("r", 4)
  //         .attr("cx", function (d) {
  //             return xScale(new Date(d.date));
  //         })
  //         .attr("cy", function (d) {
  //             return yScale(d.price * 100);
  //         });
  // }

  //VOLUME bars
  y1Bars = stockLineCht.selectAll("bars")
  .data(gData)
  .enter()
  .append("svg:rect")
  //.attr("width", (fBarWidth))
  .attr("class", "bar");

  //volume bars
  y1Bars.attr("x", function (d) { return xScale(getDate(d)) - ((width-leftPadding)/gData.length *0.75); })
  .attr("y", function (d) { return volScale(d.Volume); })
  .attr("height", function (d) { return height - volScale(d.Volume); })
  .attr("width", function (d) { return width/(gData.length * 1.5); });

  //------------------------------
  //hi-lo area
  //stockLineCht.append("path")
  //    .datum(gData)
  //    .attr("class", "area")
  //    .attr("d", area);

  stockLineCht.append("path")
  .data([gData])
  .attr("class", "area")
  .attr("d", area);

  //------------------------------
  //close line
  stockLineCht.selectAll('path.line')
  .data([gData])
  .enter()
  .append("svg:path")
  .attr("class", "line")
  .attr("d", closeLine);

  //===============================
  volAxisGroup
  .attr("class", "r axis")
  .call(volAxis);


  stockLineCht.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  yAxisGroup = stockLineCht.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + (leftPadding) + ",0)");
  yAxisGroup
  .attr("class", "y axis")
  .call(yAxis);
}

function updateChart(chartData) {

  var gData = chartData.reverse();
  //var purchaseData;
  minDate = getDate(gData[0]);
  maxDate = getDate(gData[gData.length - 1]);
  minClose = d3.min(gData, function (d) { return +d.Close; });
  maxClose = d3.max(gData, function (d) { return +d.Close; });
  maxVol = d3.max(gData, function (d) { return +d.Volume });

// high-low range area
var area = d3.svg.area()
.x0(function (d) {return xScale(getDate(d)); })
.x1(function (d) {return xScale(getDate(d)); })
.y0(function (d) {return yScale(+d.Low); })
.y1(function (d) {return yScale(+d.High); });

var closeLine = d3.svg.line()
.x(function (d) {return xScale(getDate(d));})
.y(function (d) {return yScale(+d.Close);});


  //== X SCALE ==
  xScale.domain([minDate, maxDate]);

  //== Y SCALE ==
  yScale.domain([(minClose - (minClose * 0.1)), maxClose * 1.1]);

  // == VOLUME (R) SCALE ==
  volScale.domain([0, maxVol]);

  stockLineCht = d3.select("#chart");

  var y1Bars = stockLineCht.selectAll(".bar");
  //.data(gData);
  // Remove
  //console.log('y1Bars',y1Bars);
  //y1Bars.exit().remove();
  // // Add
  // y1Bars.enter().append('rect')
  // .style('fill', 'orange');

  stockLineCht.selectAll("rect")
  .data(gData)
  .transition()
  .duration(750)
  .attr("x", function (d) { return xScale(getDate(d)) - ((width-leftPadding)/gData.length *0.75);  })
  .attr("y", function (d) { return volScale(d.Volume); })
  .attr("height", function (d) { return height - volScale(d.Volume); })
  .attr("width", function (d) { return width/(gData.length * 1.5); });








  //stockLineCht.selectAll("path")
  //    .data([gData])
  //    .attr("d", area);
  stockLineCht.select(".line") // change the line
  .transition()
  .duration(750)
  .attr("d", closeLine(gData));
  stockLineCht.select(".x.axis") // change the x axis
  .transition()
  .duration(750)
  .call(xAxis);
  stockLineCht.select(".y.axis") // change the y axis
  .transition()
  .duration(750)
  .call(yAxis);
  stockLineCht.select(".r.axis") // change the r axis
  .transition()
  .duration(750)
  .call(volAxis);

  stockLineCht.select(".area") // change the r axis
  .transition()
  .duration(750)
  .attr("d", area(gData));
}

  // helper function
  function getDate(d) {
    return new Date(d.Date);
  }



</script>

<style>

  #chart {
    width:100%;
  }

  .axis path, .axis line {
    fill: none;
    stroke: #aaa;
    stroke-width: 1;
    shape-rendering: crispEdges;
    opacity: .5

  }

  .axis {
    font-size: 11px;
    color: #444;
    font-family: Arial,sans-serif;
  }

  .axisHeading {
    font-size: 12px;
    font-weight: normal;
    color: #666;
  }

  .barMouseOver {
    cursor: pointer;
    stroke: #444;
    stroke-width: 1;
  }

  .line, .line path {
    stroke: #4e7d25;
    stroke-width: 2;
    /*stroke-dasharray: 5, 3;*/
    fill: none;
  }

  .lineLight,.lineLight path {
    stroke: #ccc;
    stroke-width: 1;
    /*stroke-dasharray: 5, 3;*/
    fill: none;
  }

  .area {
    fill:#6ebd45;
    opacity:0.2;
  }
  .bar {
    fill: #7bdaf8;
    opacity: .3;
  }
</style>


