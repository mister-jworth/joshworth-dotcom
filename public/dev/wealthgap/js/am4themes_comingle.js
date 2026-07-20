function am4themes_comingle(target) {
  if (target instanceof am4core.ColorSet) {
    target.list = [
      am4core.color("#007AFF"),
      am4core.color("#0AC83B"),
      am4core.color("blue"),
      am4core.color("green")
    ];
  }
}