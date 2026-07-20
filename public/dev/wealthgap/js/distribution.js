//Wealth distribution by percentile

am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_kelly);
  //am4core.useTheme(am4themes_comingle);
  // Themes end
  
  // Make the chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.numberFormatter.bigNumberPrefixes = [
    { "number": 1e+3, "suffix": "K" },
    { "number": 1e+6, "suffix": "M" },
    { "number": 1e+9, "suffix": "B" }
  ];
  chart.hiddenState.properties.opacity = 0;

 // Add data
chart.data = [ {
    "stack": "Bottom 90%",
    "bottom50": 3,
    "next40": 28.8,
   // "next9":0,
    //"nextpt9":0,
    //"nextpt1":0
  }, {
    "stack": "Top 10%",
    //"bottom50":0,
   // "next40":0,
    "next9":37.1,
    "nextpt9":18.5,
    "nextpt1": 12.6
  } ];
  
  // Create axes
  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "stack";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 20;
  categoryAxis.renderer.cellStartLocation = 0.1;
  categoryAxis.renderer.cellEndLocation = 0.9;
  categoryAxis.title.text = "Population Breakdown";
  
  var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.min = 0;
  valueAxis.title.text = "Share of Wealth";
  valueAxis.calculateTotals = true;

/* var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "share";
series.dataFields.categoryX = "stack";
series.stacked = true;
series.name = "Helping";
series.columns.template.strokeOpacity = 0;
series.tooltip.fontSize = "12px";
series.tooltip.fontWeight = "400";
 */ 
  
  //Create series
  function createSeries(field, name, stacked) {
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = field;
  series.dataFields.categoryX = "stack";
  series.name = name;
  series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
  series.tooltip.pointerOrientation = "vertical";
  series.stacked = stacked;
  series.columns.template.width = am4core.percent(95);
  var bullet = series.bullets.push(new am4charts.LabelBullet());
    bullet.interactionsEnabled = false;
    bullet.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet.label.fill = am4core.color("#ffffff");
    bullet.locationY = 0.5;
}

createSeries("bottom50", "Bottom 50%", true);
createSeries("next40", "50-90%", true);
createSeries("next9", "90-99%", true);
createSeries("nextpt9", "99-99.9%", true);
createSeries("nextpt1", "Top 0.1%", true);


})