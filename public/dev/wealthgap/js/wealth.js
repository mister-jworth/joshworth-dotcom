//Net worth Percentile column chart

am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_comingle);
  // Themes end
  
  // Make the chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.numberFormatter.bigNumberPrefixes = [
    { "number": 1e+3, "suffix": "K" },
    { "number": 1e+6, "suffix": "M" },
    { "number": 1e+9, "suffix": "B" }
  ];
  chart.scrollbarX = new am4core.Scrollbar();
  chart.scrollbarX.parent = chart.bottomAxesContainer;
  chart.cursor = new am4charts.XYCursor();
  chart.zoomOutButton.disabled = true;  

//Load Data
  //https://www.amcharts.com/docs/v4/concepts/data/loading-external-data/
chart.dataSource.url = "data/wealth.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;
chart.dataSource.parser.numberFields =["Percentile","A-Bottom50"]


var label = chart.createChild(am4core.Label);
label.fontSize = 24;
label.align = "center";
label.isMeasured = false;
label.x = am4core.percent(50);
label.horizontalCenter = "middle";
label.y = 50;
//label.text = "U.S. Wealth Distribution (2019)"

// Create category axes
var categoryAxisX = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxisX.dataFields.category = "Percentile";
categoryAxisX.renderer.minGridDistance = 20;
//categoryAxisX.renderer.grid.template.disabled = true;
categoryAxisX.fontSize = 11;
categoryAxisX.title.text = "Population Percentile";
categoryAxisX.title.fontWeight = "100";
categoryAxisX.title.fill = am4core.color("#666666");

var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.grid.template.disabled = false;
valueAxisY.fontSize = 10;
valueAxisY.numberFormatter = new am4core.NumberFormatter();
valueAxisY.numberFormatter.bigNumberPrefixes = [
  { "number": 1e+3, "suffix": "K" },
  { "number": 1e+6, "suffix": "M" },
  { "number": 1e+9, "suffix": "B" }
];
valueAxisY.numberFormatter.numberFormat = "$#.###a";
valueAxisY.title.text = "Median Net Worth";
valueAxisY.title.fontWeight = "100";
valueAxisY.title.fill = am4core.color("#666666");

//create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "Networth";
series.dataFields.categoryX = "Percentile";
series.name = "Percentile";
series.tooltip.fontWeight = "400";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.getFillFromObject = false;
series.tooltip.background.fill = am4core.color("#042E5D");
series.tooltipHTML ="<div class='tooltiptext-sm'>Percentile:<span class='tooltipstat'>{categoryX}</span>Net Worth:<span class='tooltipstat'>${valueY.formatNumber('#.00a')}</span></div>";

valueAxisY.cursorTooltipEnabled = false;
categoryAxisX.cursorTooltipEnabled = false;
//chart.cursor.lineY.disabled = true;
chart.cursor.lineX.stroke = am4core.color("#FFFFFF");
chart.cursor.lineX.strokeWidth = 1;
chart.cursor.lineX.strokeOpacity = 1;
chart.cursor.lineX.strokeDasharray = "";
chart.cursor.snapToSeries = series;


//add labels (range)
function createLabel(start, end, mid, label, vAlign, offsetX, offsetY, color) {
  var span = categoryAxisX.createSeriesRange(series);
  span.category = start;
  span.endCategory = end;
  span.contents.stroke = am4core.color(color);
  span.contents.fill = span.contents.stroke;

  var range = categoryAxisX.axisRanges.create();
  range.category = mid;
  range.grid.strokeOpacity = 0;
  range.label.location = 0.5;
  range.label.dataItem.text = label;
  range.label.fillOpacity = 0;
  range.label.inside = true;
  range.label.valign = vAlign;
  range.label.fontWeight = 900;
  range.label.fontSize = 16;
  range.label.fill = am4core.color(color);
  range.label.textAlign = "middle";
  range.label.dy = offsetY;
  range.label.dx = offsetX;
}

createLabel("1", "50","25", "Share:\n2%", "bottom", 0, -70, "#042E5D");
createLabel("51", "90", "70", "Share:\n29%", "bottom", 0, -100, "#007AFF");
createLabel("91", "98", "95", "Share:\n38%", "middle", -50, 0, "#008C41");
createLabel("99","99","98", "Share:\n31%", "top", -60, 100, "#00C332");

}); 



// end 
