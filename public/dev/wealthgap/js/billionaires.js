
am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_comingle);
  // Themes end
  
  // Make the chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);

//Load Data
  //https://www.amcharts.com/docs/v4/concepts/data/loading-external-data/
chart.dataSource.url = "data/billionaires.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;
//chart.dataSource.parser.reverse = true;
chart.dataSource.parser.numberFields =["Rank","Networth"]



// Column Series

// Create axes
var categoryAxisX = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxisX.dataFields.category = "Rank";
categoryAxisX.renderer.minGridDistance = 50;
categoryAxisX.renderer.grid.template.disabled = false;
categoryAxisX.fontSize = 11;
categoryAxisX.renderer.inversed = true;

var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
//valueAxisY.renderer.grid.template.disabled = false;
valueAxisY.fontSize = 10;

//Create series A
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "Networth";
series.dataFields.categoryX = "Rank";
series.name = "Billionaires";
//series.columns.template.strokeOpacity = 0;
//series.tooltip.fontSize = "12px";
//series.tooltip.fontWeight = "400";

// end column series

/* Line Series

// Create axes
var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
//valueAxisX.dataFields.category = "Percentile";
//valueAxisX.renderer.minGridDistance = 0;
valueAxisX.min = 1;
valueAxisX.max = 700; 
valueAxisX.renderer.grid.template.disabled = false;
valueAxisX.fontSize = 11;
valueAxisX.renderer.inversed = true;

var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.grid.template.disabled = false;
valueAxisY.fontSize = 10;

//Create series A
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.valueY = "Networth";
series.dataFields.valueX = "Rank";
series.name = "Billionaires";
//series.columns.template.strokeOpacity = 0;
//series.tooltip.fontSize = "12px";
//series.tooltip.fontWeight = "400";

end line series */ 

  //chart.legend = new am4charts.Legend();


 chart.scrollbarX = new am4core.Scrollbar();
 chart.scrollbarY = new am4core.Scrollbar();

}); 



// end 
