<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>U.S. Wealth Distribution (including Billionaires)</title>
	
<link rel="stylesheet" href="https://use.typekit.net/ofv2eqe.css">
<link rel="stylesheet" href="css/comingle-chart-styles.css">

<script src="https://www.amcharts.com/lib/4/core.js"></script>
<script src="https://www.amcharts.com/lib/4/charts.js"></script>
<script src="https://www.amcharts.com/lib/4/themes/animated.js"></script>
</head>

</html>

<body>
	<div class="header-bar"><a href="https://www.comingle.us" target="_blank"><img src="img/comingle-mark.svg" height="100%"></a><span class="align-right">U.S. Wealth Distribution</span></div>
	<div id="chartdiv"></div>
	<div class="btnstrip">
		<input class="btn" type="button" value="Bottom 50%" onclick="zoomBottom50(); updateSelectedButton(this);" />
		<input class="btn" type="button" value="Bottom 90%" onclick="zoomBottom90(); updateSelectedButton(this);" />
		<input class="btn" type="button" value="Bottom 99%" onclick="zoomBottom99(); updateSelectedButton(this);" /> 
		<input class="btn" type="button" value="Bottom 99.9%" onclick="zoomBottom99pt9(); updateSelectedButton(this);" /> 
		<input class="btn btn-selected" type="button" value="Everyone" onclick="zoomEveryone(); updateSelectedButton(this);" /> 
		<!--<input class="btn" type="button" value="Top 10%" onclick="zoomTop10pct(); updateSelectedButton(this);" />-->
		<input class="btn" type="button" value="Top 0.1%" onclick="zoomTopPt1pct(); updateSelectedButton(this);" />
		<input class="btn" type="button" value="Billionaires" onclick="zoomBillionaires(); updateSelectedButton(this);" />
		<input class="btn" type="button" value="Top 100" onclick="zoomTop100(); updateSelectedButton(this);" />
		<input class="btn" type="button" value="Top 10" onclick="zoomTop10(); updateSelectedButton(this);" />
	</div>

	<div class="notes">
	Median Net worth data from <a href="https://www.federalreserve.gov/econres/scfindex.htm" target="_blank">2019 Federal Reserve Survey of Consumer Finance</a> <br/> 
	Share of wealth data from <a href="https://www.federalreserve.gov/releases/z1/dataviz/dfa/distribute/table/" target="_blank">Federal Reserve Distributional Financial Accounts</a>   <br/> 
	Billionaire data from <a href="https://www.forbes.com/real-time-billionaires/#b9aed653d788" target="_blank">Forbes: The World's Real-Time Billionaires</a> (March 2023)
	</div>
</body>
	
<script src="js/am4themes_comingle.js"></script>
<script src="js/allnetworth.js"></script>

</html>
