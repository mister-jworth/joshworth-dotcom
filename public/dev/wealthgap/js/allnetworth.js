
//am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  am4core.useTheme(am4themes_comingle);
  // Themes end
  
  // Make the chart
  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.zoomOutButton.disabled = true;
  chart.numberFormatter.bigNumberPrefixes = [
    { "number": 1e+3, "suffix": "K" },
    { "number": 1e+6, "suffix": "M" },
    { "number": 1e+9, "suffix": "B" }
  ];
  chart.events.on("ready", function(ev) {
    //put initializing stuff here
    zoomEveryone();
    //zoomBottom50();
  });
 
  //title
  var label = chart.createChild(am4core.Label);
  label.fontSize = 24;
  label.align = "center";
  label.isMeasured = false;
  label.x = am4core.percent(50);
  label.horizontalCenter = "middle";
  label.y = 50;
  label.opacity = 1;

    //subtitle
    var sublabel = chart.createChild(am4core.Label);
    sublabel.fontSize = 16;
    sublabel.fontWeight = 300;
    sublabel.align = "center";
    sublabel.isMeasured = false;
    sublabel.x = am4core.percent(50);
    sublabel.horizontalCenter = "middle";
    sublabel.y = 100;
    sublabel.opacity = .8;


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
valueAxisY.min = -10000;
valueAxisY.max = 186900000000;
valueAxisY.numberFormatter = new am4core.NumberFormatter();
valueAxisY.numberFormatter.bigNumberPrefixes = [
  { "number": 1e+3, "suffix": "K" },
  { "number": 1e+6, "suffix": "M" },
  { "number": 1e+9, "suffix": "B" }
];
valueAxisY.numberFormatter.numberFormat = "#.###a";
valueAxisY.title.text = "Median Net Worth";
valueAxisY.title.fontWeight = "100";
valueAxisY.title.fill = am4core.color("#666666");
//valueAxisY.strictMinMax = true;

// Create X value axes
var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
valueAxisX.min = 0;
valueAxisX.max = 99.9999999; 
valueAxisX.renderer.grid.template.disabled = false;
valueAxisX.fontSize = 11;
valueAxisX.numberFormatter = new am4core.NumberFormatter();
valueAxisX.numberFormatter.numberFormat = "#.#################";
valueAxisX.maxZoomFactor = 100000000000000000;
valueAxisX.title.text = "Percentile";
valueAxisX.title.fontWeight = "100";
valueAxisX.title.fill = am4core.color("#666666");

//SERIES
var series = chart.series.push(new am4charts.StepLineSeries());
series.dataFields.valueY = "Networth";
series.dataFields.valueX = "Percentile";
series.name = "Net Worth";
series.fillOpacity = 1;
series.startLocation = 0;
series.strokeWidth = 2;
series.tooltip.fontWeight = "400";
series.tooltip.pointerOrientation = "vertical";
series.tooltip.getFillFromObject = false;
series.tooltip.background.fill = am4core.color("#042E5D");
//series.tooltip.getStrokeFromObject = true;
//series.tooltip.background.stroke = am4core.color("#00B22E");
//series.tooltip.background.filters.clear();
var shadow = series.tooltip.background.filters.getIndex(0);
shadow.dx = 10;
shadow.dy = 10;
shadow.blur = 5;
shadow.opacity = .07;
//shadow.color = am4core.color("#f55");

var gradient = new am4core.LinearGradient();
gradient.addColor(am4core.color("#013773"));
gradient.addColor(am4core.color("#2557B2"));
gradient.addColor(am4core.color("#2C66D0"));
gradient.addColor(am4core.color("#2E6CDD"));
gradient.addColor(am4core.color("#3172E9"));
gradient.addColor(am4core.color("#3477F6"));
gradient.addColor(am4core.color("#50AF46"));
gradient.addColor(am4core.color("#6BDF43"));
gradient.rotation = 0;

series.fill = gradient;
series.stroke = gradient;

/*
//add ranges
function createRange(start, end, color) {
  var range = valueAxisX.createSeriesRange(series);
  range.value = start;
  range.endValue = end;
  //range.contents.fillOpacity = 1;
  //range.contents.stroke = am4core.color(color);
  //range.contents.fill = am4core.color(color);
}

createRange(1.0000000,50.0000000, "#0063CF");
createRange(50.0000001,90.0000000, "#007AFF"); 
createRange(90.0000001, 99.9000000, "#01B22F");
createRange(99.9000001, 99.9999999, "#20E400");
*/

/*
var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.fill = am4core.color("white");
bullet.width = 2;
bullet.strokeWidth = 1;
*/


// ZOOM BUTTONS
function zoomEveryone() {
  valueAxisX.zoomToValues(0, 99.9999999);
  //valueAxisY.zoomToValues(-10000, 186900000000);
  valueAxisY.min = 0;
  valueAxisY.max = 186900000000;
  valueAxisX.renderer.minGridDistance = 120;
  series.strokeWidth = 5;
  label.text = "This is everyone"
  sublabel.text = " "
  setTooltipA();
}

function zoomBottom50() {
  valueAxisX.zoomToValues(0, 51.0);
  //valueAxisY.zoomToValues(-94517, 17557208);
  valueAxisY.min = -94517;
  valueAxisY.max = 121411;
  valueAxisX.renderer.minGridDistance = 120;
  label.text = "Bottom 50%"
  sublabel.text = "166M Americans share 3% of the wealth"
  setTooltipA();
}

function zoomBottom90() {
  valueAxisX.zoomToValues(0, 91.0);
  //valueAxisY.zoomToValues(-94517, 17557208);
  valueAxisY.min = -94517;
  valueAxisY.max = 1355268;
  valueAxisX.renderer.minGridDistance = 100;
  label.text = "Bottom 90%"
  sublabel.text = "32% of U.S. wealth"
  setTooltipA();
}

  function zoomBottom99() {
    valueAxisX.rangeChangeDuration = 500;
    valueAxisY.rangeChangeDuration = 500;
    valueAxisX.zoomToValues(0, 99.0);
    //valueAxisY.zoomToValues(-94517, 17557208);
    valueAxisY.min = -94517;
    valueAxisY.max = 11099166;
    valueAxisX.renderer.minGridDistance = 100;
    label.text = "The 99%";
    sublabel.text = "69% of U.S. wealth"
    setTooltipA();
  }

  function zoomBottom99pt9() {
    valueAxisX.zoomToValues(0, 99.9);
    //valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 0;
    valueAxisY.max = 51010461;
    valueAxisX.renderer.minGridDistance = 80;
    label.text = "The 99.9%";
    sublabel.text = "87% of U.S. wealth"
    setTooltipA();
  }

  function zoomTop10pct() {
    valueAxisX.zoomToValues(90.0, 99.9999997);
    //valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 80;
    //series.strokeWidth = 5;
    label.text = "Top 10%";
    sublabel.text = "31% of U.S. wealth"
    setTooltipA();
  }

  function zoomTop1pct() {
    valueAxisX.zoomToValues(99.0, 99.9999997);
    //valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 80;
    label.text = "Top 1%";
    setTooltipA();
  }

  function zoomTopPt1pct() {
    valueAxisX.zoomToValues(99.9, 99.9999997);
    //valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 51010461;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 80;
    label.text = "Top 0.1%";
    sublabel.text = "13% of U.S. wealth"
    setTooltipA();
  }

  function zoomBillionaires() {
    //valueAxisY.strictMinMax = false;
    valueAxisX.zoomToValues(99.9997846, 99.9999999);
    //valueAxisY.zoomToValues(900000000, 186900000000);
    //series.tooltipHTML ="<div class='tooltiptext'><span class='tooltipperson'>{Name}</span>{Source}</br>% Rank:</br><span class='tooltipstat'>{valueX}</span>Net Worth:<span class='tooltipstat'>${valueY}</span></div>";
    valueAxisY.min = 800000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 60;
    label.text = "Billionaires Only";
    sublabel.text = "4% of U.S. wealth"
    setTooltipB();
    //valueAxisY.syncWithAxis = valueAxisX;
  }

  function zoomTop100() {
    valueAxisX.zoomToValues(99.9999697, 99.9999999);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 60;
    label.text = "Top 100";
    sublabel.text = "2% of U.S. wealth"
    setTooltipB();
  }

  function zoomTop10() {
    valueAxisX.zoomToValues(99.9999970, 99.9999999);
    //valueAxisY.zoomToValues(0, 186900000000);
    valueAxisY.min = 900000000;
    valueAxisY.max = 186900000000;
    valueAxisX.renderer.minGridDistance = 60;
    label.text = "Top 10";
    sublabel.text = "1% of U.S. wealth"
    setTooltipB();
  }

  chart.cursor = new am4charts.XYCursor();
  valueAxisY.cursorTooltipEnabled = false;
  valueAxisX.cursorTooltipEnabled = false;
  chart.cursor.lineY.disabled = true;
  chart.cursor.lineX.stroke = am4core.color("#FFFFFF");
  chart.cursor.lineX.strokeWidth = 1;
  chart.cursor.lineX.strokeOpacity = 1;
  chart.cursor.lineX.strokeDasharray = "";
  chart.cursor.snapToSeries = series;

  function updateSelectedButton(clickedButton) {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.classList.remove('btn-selected');
    });
   
    clickedButton.classList.add('btn-selected');
  }

  function setTooltipA() {
    series.tooltipHTML ="<div class='tooltiptext-sm'>% Rank:<span class='tooltipstat'>{valueX}</span>Net Worth:<span class='tooltipstat'>${valueY.formatNumber('#.00a')}</span></div>";
  }

  function setTooltipB() {
    series.tooltipHTML ="<div class='tooltiptext'><span class='tooltipperson'>{Name}</span>{Source}</br>% Rank:</br><span class='tooltipstat'>{valueX.formatNumber('#.##############')}</span>Net Worth:<span class='tooltipstat'>${valueY.formatNumber('#.0a')}</span></div>";
  }





/* //turn off that last toolTip?
var lastDataItem = chart.dataSource[1];
console.log("last item", lastDataItem);

  chart.cursor.events.on("cursorpositionchanged", function(ev) {
    var xAxis = ev.target.chart.xAxes.getIndex(0);
    //var yAxis = ev.target.chart.yAxes.getIndex(0);
    if (xAxis.positionToValue(xAxis.toAxisPosition(ev.target.xPosition)) > 99.9999997){
      console.log("hit");
      series.tooltip.disabled = "false";
    }
  });
  */

//lastDataItem.tooltip.disabled = true;
  

//Pre-zoom the chart?
//valueAxisX.zoomToValues(0, 99.9999999);
//valueAxisY.zoomToValues(0, 186900000000);
//valueAxisX.keepSelection = true;
//valueAxisY.syncWithAxis = valueAxisX;

//}); 






// end 

//axis ranges
//https://www.amcharts.com/docs/v4/tutorials/grouping-axis-labels-using-ranges/

//overlaid columns
//https://www.amcharts.com/docs/v4/tutorials/overlaid-column-series/

//pre-zooming
//https://www.amcharts.com/docs/v4/tutorials/pre-zooming-an-axis/

//axis scal info
//https://www.amcharts.com/docs/v4/tutorials/fixed-value-axis-scale/#Manual_scale

// zoom controls
//https://www.amcharts.com/docs/v4/tutorials/zooming-axis-via-api-or-external-scrollbar/#Zooming_chart_via_API

