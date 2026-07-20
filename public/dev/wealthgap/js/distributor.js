//Net worth Percentile column chart

//am4core.ready(function() {

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
  //chart.legend = new am4charts.Legend();

//Load Data
  //https://www.amcharts.com/docs/v4/concepts/data/loading-external-data/
chart.dataSource.url = "data/distributor.csv";
chart.dataSource.parser = new am4core.CSVParser();
chart.dataSource.parser.options.useColumnNames = true;
chart.dataSource.parser.numberFields =["Networth, Socialism, Capitalism, UBI"]


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
categoryAxisX.renderer.minGridDistance = 1;
categoryAxisX.renderer.labels.template.disabled = true;
categoryAxisX.renderer.grid.template.disabled = true;
categoryAxisX.fontSize = 11;
//categoryAxisX.title.text = "Population Percentile";
categoryAxisX.title.fontWeight = "100";
categoryAxisX.title.fill = am4core.color("#666666");

var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.grid.template.disabled = true;
valueAxisY.renderer.labels.template.disabled = true;
valueAxisY.fontSize = 10;
valueAxisY.numberFormatter = new am4core.NumberFormatter();
valueAxisY.numberFormatter.bigNumberPrefixes = [
  { "number": 1e+3, "suffix": "K" },
  { "number": 1e+6, "suffix": "M" },
  { "number": 1e+9, "suffix": "B" }
];
valueAxisY.numberFormatter.numberFormat = "$#.###a";
//valueAxisY.title.text = "Median Net Worth";
valueAxisY.title.fontWeight = "100";
valueAxisY.title.fill = am4core.color("#666666");
valueAxisY.min = -100000;
valueAxisY.max = 12000000; 
valueAxisY.strictMinMax = true;


//create series
var seriesA = chart.series.push(new am4charts.ColumnSeries());
seriesA.dataFields.valueY = "Socialism";
seriesA.dataFields.categoryX = "Percentile";
seriesA.name = "Socialism";
seriesA.stacked = "true";
seriesA.fill = am4core.color("#00C633")
seriesA.stroke = am4core.color("#00C633")

var seriesC = chart.series.push(new am4charts.ColumnSeries());
seriesC.dataFields.valueY = "UBI";
seriesC.dataFields.categoryX = "Percentile";
seriesC.name = "UBI";
seriesC.stacked = "true";
seriesC.fill = am4core.color("#007AFF")
seriesC.stroke = am4core.color("#007AFF") 

var seriesE = chart.series.push(new am4charts.ColumnSeries());
seriesE.dataFields.valueY = "CapUBI";
seriesE.dataFields.categoryX = "Percentile";
seriesE.name = "CapUBI";
seriesE.stacked = "true";
seriesE.fill = am4core.color("#00C633")
seriesE.stroke = am4core.color("#00C633")

var seriesB = chart.series.push(new am4charts.ColumnSeries());
seriesB.dataFields.valueY = "Capitalism";
seriesB.dataFields.categoryX = "Percentile";
seriesB.name = "Capitalism";
seriesB.stacked = "true";
seriesB.fill = am4core.color("#00C633")
seriesB.stroke = am4core.color("#00C633")

var seriesD = chart.series.push(new am4charts.ColumnSeries());
seriesD.dataFields.valueY = "Reality";
seriesD.dataFields.categoryX = "Percentile";
seriesD.name = "Reality";
seriesD.stacked = "true";
seriesD.fill = am4core.color("#00C633")
seriesD.stroke = am4core.color("#00C633")

var seriesF = chart.series.push(new am4charts.ColumnSeries());
seriesF.dataFields.valueY = "None";
seriesF.dataFields.categoryX = "Percentile";
seriesF.name = "None";
seriesF.stacked = "true";
seriesF.fill = am4core.color("#00C633")
seriesF.stroke = am4core.color("#00C633")



valueAxisY.cursorTooltipEnabled = false;
categoryAxisX.cursorTooltipEnabled = false;

chart.dy = -80;
chart.maskBullets = false;

let image = new am4core.Image();
image.horizontalCenter = "middle";
image.width = 12;
image.height = 12;
image.verticalCenter = "top";
image.dy = 80;
image.href="img/user.svg";
categoryAxisX.dataItems.template.bullet = image;


function socialism() {
      seriesA.show();
      seriesB.hide();
      seriesC.hide();
      seriesD.hide();
      seriesE.hide();
      seriesF.hide();
  }

  function capitalism() {
    seriesA.hide();
    seriesB.show();
    seriesC.hide();
    seriesD.hide();
    seriesE.hide();
    seriesF.hide();
}

function ubi() {
    seriesA.hide();
    seriesB.hide();
    seriesC.show();
    seriesD.hide();
    seriesE.show();
    seriesF.hide();

}

    function reality() {
        seriesA.hide();
        seriesB.hide();
        seriesC.hide();
        seriesD.show();
        seriesE.hide();
        seriesF.hide();

    }

    function none() {
        seriesA.hide();
        seriesB.hide();
        seriesC.hide();
        seriesD.hide();
        seriesE.hide();
        seriesF.show();

    }

/*add labels (range)
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
*/

//}); 



// end 
