


am5.ready(function() {

// Make the chart
var root = am5.Root.new("chartdiv");

// Themes
root.setThemes([
  am5themes_Animated.new(root)
]);
// Setup

//auto zoom https://codepen.io/team/amcharts/pen/QWBRdjE?editors=0110

var chart = root.container.children.push(
  am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true
  })
);


//Load external data
am5.net.load("/data/networth.csv").then(function(result) {
  
  // Parse data
  var data = am5.CSVParser.parse(result.response, {
    useColumnNames: true
  });

  // Process data
  var processor = am5.DataProcessor.new(root, {
    numericFields: ["A-Wealth", "B-Wealth","C-Wealth","D-Wealth","E-Wealth"],
    textFields: ["A-Bottom50","B-Next40","C-Next9","D-TopPt9","E-TopPt1"]
  });
  processor.processMany(data);

  // Use parsed/processed data
  series.data.setAll(data);

});


var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  maxDeviation: 0.3,
  categoryField: "A-Bottom50",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
}));

var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  maxDeviation: 0.3,
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));


// Create series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
  name: "Series 1",
  xAxis: xAxis,
  yAxis: yAxis,
  valueYField: "A-Wealth",
  sequencedInterpolation: true,
  categoryXField: "A-Bottom50",
  tooltip: am5.Tooltip.new(root, {
    labelText: "{valueY}"
  })
}));

series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
series.columns.template.adapters.add("fill", function(fill, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});

series.columns.template.adapters.add("stroke", function(stroke, target) {
  return chart.get("colors").getIndex(series.columns.indexOf(target));
});



/* Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
chart.set("scrollbarX", am5.Scrollbar.new(root, {
  orientation: "horizontal"
}));
*/

//chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
//chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));



}); 
// end 
