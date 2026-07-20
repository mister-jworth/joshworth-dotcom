
am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_comingle);
  // Themes end
  
  // Make the chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);

//Load Data
  //https://www.amcharts.com/docs/v4/concepts/data/loading-external-data/
chart.dataSource.url = "data/wealth-breakdown.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;
chart.dataSource.parser.numberFields =["Percentile","A-Bottom50"]

// Create value Y axiz
var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.grid.template.disabled = false;
valueAxisY.fontSize = 10;
valueAxisY.min = -137416986521;
valueAxisY.max = 71382056000000;
valueAxisY.extraMin = 0;
valueAxisY.extraMax = 0; 
//valueAxisY.renderer.minGridDistance = 0;
//valueAxisY.strictMinMax = true;


// LINES
// Create value axes
var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
//valueAxisX.dataFields.category = "Percentile";
//valueAxisX.renderer.minGridDistance = 0;
valueAxisX.min = 0;
valueAxisX.max = 100; 
valueAxisX.renderer.grid.template.disabled = false;
valueAxisX.fontSize = 11;

// Create multiple line series
function createSeries(field, fieldname) {
    //var series = chart.series.push(new am4charts.LineSeries());
    var series = chart.series.push(new am4charts.StepLineSeries());
    series.dataFields.valueY = field;
    series.dataFields.valueX = "Percentile";
    series.name = fieldname
    series.tooltip.fontSize = "12px";
    series.tooltip.fontWeight = "400";
    series.fillOpacity = 1;
    //series.tensionX = 0.8;
    //series.tensionY = 0.8;
    return series;
  }

  valueAxisY.syncWithAxis = valueAxisX;
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



  createSeries("A-Bottom50", "Bottom 50%", 100);
  createSeries("B-Next40", "Next 40%", 100);
  createSeries("C-Next9", "Next 9%",90);
  createSeries("D-TopPt9", "Top 1%",10);
  createSeries("Pt1", ".1",1);

  //createSeries("E-TopPt1","Top .1%");

  chart.legend = new am4charts.Legend();


  chart.scrollbarX = new am4core.Scrollbar();
  //chart.scrollbarY = new am4core.Scrollbar();

}); 



// end 

//axis ranges
//https://www.amcharts.com/docs/v4/tutorials/grouping-axis-labels-using-ranges/

//overlaid columns
//https://www.amcharts.com/docs/v4/tutorials/overlaid-column-series/

//pre-zooming
//https://www.amcharts.com/docs/v4/tutorials/pre-zooming-an-axis/

// zoom controls
//https://www.amcharts.com/docs/v4/tutorials/zooming-axis-via-api-or-external-scrollbar/#Zooming_chart_via_API

