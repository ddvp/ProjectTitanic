require([
  "require",
  "exports",
  "knockout",
  "ojs/ojbootstrap",
  "ojs/ojmodel",
  "ojs/ojcollectiondataprovider",
  "MockRESTServer",
  "text!resources/titanic.json",
  "ojs/ojknockout",
  "ojs/ojtable",
  "ojs/ojcheckboxset",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojdialog",
  "ojs/ojbutton",
  "mockjax",
  "ojs/ojformlayout",
], function (
  require,
  exports,
  ko,
  ojbootstrap_1,
  ojmodel_1,
  CollectionDataProvider,
  MockRESTServer,
  jsonData
) {
  "use strict";

  class viewModel {
    constructor() {
      this.somethingChecked = ko.observable(false);
      this.currentDeptName = ko.observable("default");
      this.newDeptId = ko.observable(555);
      this.newDeptName = ko.observable("");
      this.workingId = ko.observable("");
      this.findDeptIds = () => {
        let selectedIdsArray = [];
        const divs = document.getElementsByTagName("oj-checkboxset");
        for (let i = 0; i < divs.length; i++) {
          const cbComp = divs[i];
          if (cbComp.value && cbComp.value.length) {
            selectedIdsArray.push(cbComp.value[0]);
          }
        }
        return selectedIdsArray;
      };
      this.enableDelete = (event) => {
        this.somethingChecked(
          event &&
            event.detail &&
            event.detail.value &&
            event.detail.value.length
        );
      };
      this.deleteDepartment = (event, data) => {
        let deptIds = [];
        deptIds = this.findDeptIds();
        const collection = data.DeptCol();
        deptIds.forEach((value) => {
          const model = collection.get(value);
          if (model) {
            collection.remove(model);
            model.destroy();
          }
        });
        this.enableDelete();
        document.getElementById("table").refresh();
      };
      this.showChangeNameDialog = (deptId, event, data) => {
        const currName = data.DepartmentName;
        this.workingId(deptId);
        this.currentDeptName(currName);
        document.getElementById("editDialog").open();
      };
      this.cancelDialog = () => {
        document.getElementById("editDialog").close();
        return true;
      };
      this.updateDeptName = (event) => {
        const currentId = this.workingId();
        const myCollection = this.DeptCol();
        const myModel = myCollection.get(currentId);
        const newName = this.currentDeptName();
        if (newName != myModel.get("DepartmentName") && newName != "") {
          myModel.save(
            {
              DepartmentName: newName,
            },
            {
              success: (myModel, response, options) => {
                document.getElementById("editDialog").close();
              },
              error: (jqXHR, textStatus, errorThrown) => {
                alert("Update failed with: " + textStatus);
                document.getElementById("editDialog").close();
              },
              wait: true,
            }
          );
        } else {
          alert(
            "Department Name is not different or the new name is not valid"
          );
          document.getElementById("editDialog").close();
        }
      };
      this.addDepartment = () => {
        const recordAttrs = {
          DepartmentId: this.newDeptId(),
          DepartmentName: this.newDeptName(),
        };
        this.DeptCol().create(recordAttrs, {
          wait: true,
          contentType: "application/vnd.oracle.adf.resource+json",
          success: (model, response) => {},
          error: (jqXHR, textStatus, errorThrown) => {},
        });
      };
      this.serviceURL = "http://mockrest/stable/rest/Departments";
      this.DeptCol = ko.observable();
      this.datasource = ko.observable();
      this.parseSaveDept = (response) => {
        return {
          DepartmentId: response["DepartmentId"],
          DepartmentName: response["DepartmentName"],
          LocationId: response["LocationId"],
          ManagerId: response["ManagerId"],
        };
      };
      this.parseDept = (response) => {
        return {
          DepartmentId: response["DepartmentId"],
          DepartmentName: response["DepartmentName"],
          LocationId: response["LocationId"],
          ManagerId: response["ManagerId"],
        };
      };
      this.Department = ojmodel_1.Model.extend({
        urlRoot: this.serviceURL,
        parse: this.parseDept,
        parseSave: this.parseSaveDept,
        idAttribute: "DepartmentId",
      });
      this.myDept = new this.Department();
      this.DeptCollection = ojmodel_1.Collection.extend({
        url: this.serviceURL,
        model: this.myDept,
        comparator: "DepartmentId",
      });
      this.DeptCol(new this.DeptCollection());
      new MockRESTServer(JSON.parse(jsonData), {
        id: "DepartmentId",
        url: /^http:\/\/mockrest\/stable\/rest\/Departments(\?limit=([\d]*))?$/i,
        idUrl: /^http:\/\/mockrest\/stable\/rest\/Departments\/([\d]+)$/i,
      });
      this.datasource(new CollectionDataProvider(this.DeptCol()));
    }
  }
  (0, ojbootstrap_1.whenDocumentReady)().then(() => {
    ko.applyBindings(new viewModel(), document.getElementById("mainContent"));
  });
});
