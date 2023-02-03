require([
  "require",
  "exports",
  "knockout",
  "ojs/ojbootstrap",
  "ojs/ojarraydataprovider",
  "text!resources/titanic.json",
  "ojs/ojtable",
  "ojs/ojknockout",
], function (require, exports, ko, ojbootstrap_1, ArrayDataProvider, deptData) {
  "use strict";

  class dashoardViewModel {
    constructor() {
      this.deptArray = JSON.parse(deptData);
      this.dataprovider = new ArrayDataProvider(this.deptArray, {
        keyAttributes: "DepartmentId",
        implicitSort: [{ attribute: "DepartmentId", direction: "ascending" }],
      });
    }
  }
  ojbootstrap_1.whenDocumentReady().then(function () {
    ko.cleanNode(document.getElementById("table"));
    ko.applyBindings(new dashoardViewModel(), document.getElementById("table"));
  });
});
