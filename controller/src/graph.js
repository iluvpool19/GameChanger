var m = [10, 30, 10, 10];
var h = 250 - m[0] - m[2];






var dataObj = {};
var chartVariable;
var graphButtonsOnPage = false;


function buildGraphButtons(keys) {
  $(".graphButtons").remove();
  dataObj = {};
  keys.forEach(key => {
    var button = "<button class='graphButtons btn btn-default' id=\"" + key + "\" onclick='changeData(\"" + key + "\")'>" + key + "</button>"
    $("#graphOptions").append(button);
    dataObj[key] = [];
  })
  changeData(keys[0]);
  graphButtonsOnPage = true;
  renderChart(chartVariable);
}



socket.on('chartData', data => {
  if (graphButtonsOnPage) {
    setData(data);
    renderChart(chartVariable);
  }
})

function changeData(key) {
  chartVariable = key;
  $(".graphButtons").removeClass('selectedButton');
  $("#" + chartVariable).addClass('selectedButton');
  $('#chartTitle').text(chartVariable);
}


function setData(data) {
  var vars = Object.keys(data);
  vars.forEach(key => {
    if (dataObj[key].length >= 21) {
      dataObj[key].shift()
    }

    dataObj[key].push(data[key]);

  })
}

window.addEventListener('resize', () => {
  renderChart(chartVariable)
});

function renderChart(key) {
  $('#graph').empty()
  var width = $('#graph').width()
  var w = width - m[1] - m[3];

  var x = d3.scale.linear().domain([0, 20]).range([0, w - 2 * m[1]]);

  var graph = d3.select("#graph").append("svg:svg")
    .attr("width", w)
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(5).tickSubdivide(true);

  graph.append("svg:g")
    .attr('class', 'x_axis')
    .attr('transform', "translate(" + m[1] + "," + (h) + ")")
    .call(xAxis);




  var dataArr = dataObj[key];
  var yMax = Math.max(...dataArr) * 1.25 || 1;
  var yAxis = d3.scale.linear().domain([0, yMax]).range([h, 0]);

  var line = d3.svg.line()
    .x(function(d, i) {
      // verbose logging to show what's actually being done
      // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
      // return the X coordinate where we want to plot this datapoint
      return x(i);
    })
    .y(function(d) {
      // verbose logging to show what's actually being done
      // return the Y coordinate where we want to plot this datapoint
      return yAxis(d);
    })


  var yAxisLeft = d3.svg.axis().scale(yAxis).ticks(Math.min(Math.floor(yMax), 5)).orient('left');

  graph.selectAll(".y_axis").remove();
  graph.append("svg:g")
    .attr("class", "y_axis")
    .attr("transform", "translate(" + m[1] + ", 0)")
    .call(yAxisLeft);

  graph.selectAll(".plot").remove();
  graph.append("svg:path").attr("class", "plot").attr("transform", "translate(" + m[1] + ", 0)").attr("d", line(dataArr));

}
