
//am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_comingle);
  // Themes end
  
  // Make the chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.numberFormatter.numberFormat = "#,###.#######";

  chart.events.on("ready", function(ev) {
    valueAxis.min = valueAxis.minZoomed;
    valueAxis.max = valueAxis.maxZoomed;
  });
    

//Load Data
  //https://www.amcharts.com/docs/v4/concepts/data/loading-external-data/
chart.dataSource.url = "data/all-networth.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;
chart.dataSource.parser.numberFields =["Name","Source"]

// Create value Y axiz
var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.grid.template.disabled = false;
valueAxisY.fontSize = 10;
//valueAxisY.min = -10000;
//valueAxisY.max = 186900000000;
//valueAxisY.extraMin = 0;
//valueAxisY.extraMax = 0; 
//valueAxisY.renderer.minGridDistance = 0;
//valueAxisY.strictMinMax = true;

// LINES
// Create value axes
var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
//valueAxisX.min = 0;
//valueAxisX.extraMin = 0;
//valueAxisX.extraMax = 0; 
//valueAxisX.max = 99.9992154; 
//valueAxisX.renderer.grid.template.disabled = false;
valueAxisX.fontSize = 11;
//valueAxisY.strictMinMax = true;
//valueAxisX.renderer.inversed = true;
valueAxisX.maxZoomFactor = 100000000000000000;

// Create multiple line series
function createSeries(field, fieldname) {
    //var series = chart.series.push(new am4charts.LineSeries());
    //series.tensionX = 0.8;
    //series.tensionY = 0.8;
    var series = chart.series.push(new am4charts.StepLineSeries());
    series.dataFields.valueY = field;
    series.dataFields.valueX = "Percentile";
    series.name = fieldname
    series.tooltip.fontSize = "12px";
    series.tooltip.fontWeight = "400";
    series.fillOpacity = 1;
    series.startLocation = .5;
    series.endLocation = .5;
    series.strokeWidth = 6;
    series.stroke = am4core.color("blue");
    return series;
  }


  //valueAxisX.syncWithAxis = valueAxisY;
// END LINES

/*
//COLUMNS
// Create category axes
var categoryAxisX = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxisX.dataFields.category = "Percentile";
categoryAxisX.renderer.minGridDistance = 20;
//categoryAxisX.min = 0;
//categoryAxisX.max = 100; 
categoryAxisX.renderer.grid.template.disabled = false;
categoryAxisX.fontSize = 11;

// Create multiple column series
function createSeries(field, fieldname, colwidth) {
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "Percentile";
    series.name = fieldname
    series.tooltip.fontSize = "12px";
    series.tooltip.fontWeight = "400";
    series.fillOpacity = 1;
    series.columns.template.width = am4core.percent(colwidth);
    series.sequencedInterpolation = true;
    series.stacked = true;
    return series;
  }
 //END COLUMNS
*/


  createSeries("Networth", "Net Worth", 100);
  //createSeries("B-Next40", "Next 40%", 100);
  //createSeries("C-Next9", "Next 9%",90);
  //createSeries("D-TopPt9", "Top 1%",10);
  //createSeries("Pt1", ".1",1);
  //createSeries("E-TopPt1","Top .1%");

  //chart.legend = new am4charts.Legend();
  //chart.scrollbarX = new am4core.Scrollbar();
  //chart.scrollbarY = new am4core.Scrollbar();

  function zoomBottom99() {
    valueAxisX.zoomToValues(0, 99.5);
    valueAxisY.zoomToValues(-94517, 17557208);
    valueAxisY.min = -94517.000;
    valueAxisY.max = 17557208;
    //Do a thing where current zoom gets put into max/min?
    //https://www.amcharts.com/docs/v4/tutorials/fixed-value-axis-scale/#Manual_scale
    valueAxisX.renderer.minGridDistance = 120;
  }
  
  function zoomBillionaires() {
    valueAxisX.zoomToValues(99.9997846, 99.9999999);
    valueAxisY.zoomToValues(900000000, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 120;
  }

  function zoomTop100() {
    valueAxisX.zoomToValues(99.9999697, 99.9999999);
    valueAxisY.zoomToValues(900000000, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 120;

  }

  function zoomTop10() {
    valueAxisX.zoomToValues(99.9999970, 99.9999999);
    valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 80;
  }

  function zoomTop1pct() {
    valueAxisX.zoomToValues(99.9, 99.9999997);
    valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 80;
  }

  function zoomTop10pct() {
    valueAxisX.zoomToValues(99.0, 99.9999997);
    valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 80;
  }

//Pre-zoom the chart?
//valueAxisX.zoomToValues(0, 99.9999999);
valueAxisY.zoomToValues(0, 186900000000);
valueAxisX.keepSelection = true;

//valueAxisY.syncWithAxis = valueAxisX;


//}); 






// end 

//axis ranges
//https://www.amcharts.com/docs/v4/tutorials/grouping-axis-labels-using-ranges/

//overlaid columns
//https://www.amcharts.com/docs/v4/tutorials/overlaid-column-series/

//pre-zooming
//https://www.amcharts.com/docs/v4/tutorials/pre-zooming-an-axis/

// zoom controls
//https://www.amcharts.com/docs/v4/tutorials/zooming-axis-via-api-or-external-scrollbar/#Zooming_chart_via_API

