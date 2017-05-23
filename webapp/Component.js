sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",//
    "sap/ui/Device"//,
    //"sap/ui/model/resource/ResourceModel"
], function (UIComponent,JSONModel) {
    "use strict";
    return UIComponent.extend("p1942286791trial.hiadmin.webapp.Component", {
        metadata: {
        rootview: "p1942286791trial.hiadmin.view.loginView"
        },
        createContent: function(){
            //http://stackoverflow.com/questions/28492850/sapui5-component-metadata-rootview-parameter-for-jsonview
            var loginPage = sap.ui.view({id:"idViewLogin", viewName:"p1942286791trial.hiadmin.view.loginView", type:sap.ui.core.mvc.ViewType.JS});
            var editorPage = sap.ui.view({id:"idViewEditor", viewName:"p1942286791trial.hiadmin.view.editorView", type:sap.ui.core.mvc.ViewType.JS});
            var fileEditorPage = sap.ui.view({id:"idViewFileEditor", viewName:"p1942286791trial.hiadmin.view.fileEditorView", type:sap.ui.core.mvc.ViewType.JS});
            var modelPage = sap.ui.view({id:"idViewModels", viewName:"p1942286791trial.hiadmin.view.modelView", type:sap.ui.core.mvc.ViewType.JS});
            var app = new sap.m.App("idAppHi",{initialPage:"idViewLogin"});
            app.addPage(loginPage);
            app.addPage(editorPage);
            app.addPage(fileEditorPage);
            app.addPage(modelPage);
            return app;
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oModel = new JSONModel("model/model.json");
            this.setModel(oModel);

// 			var oDeviceModel = new JSONModel(Device);
// 			oDeviceModel.setDefaultBindingMode("OneWay");
// 			this.setModel(oDeviceModel, "device");

         // set i18n model
        //  var i18nModel = new ResourceModel({
        //     bundleName : "i18n.i18n"
        //  });
        //  this.setModel(i18nModel, "i18n");
        }
   });
});