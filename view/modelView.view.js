sap.ui.jsview("p1942286791trial.hiadmin.view.modelView", {  // this View file is called modelView.view.js within ./view/
   
    getControllerName: function() {
        return "p1942286791trial.hiadmin.controller.modelController";     // the Controller lives in modelController.controller.js
    },

    createContent: function(modelController) {
        var models = new sap.m.Table("models", {   
            headerText : "Models",
            headerDesign : sap.m.ListHeaderDesign.Standard,
            mode : sap.m.ListMode.None,
            includeItemInSelection : false,
            columns: [
                new sap.m.Column({
                    width : "1em",
                    header : new sap.m.Label({
                        text : "Model Name"
                    })
                }),
                new sap.m.Column({
                    width : "1em",
                    header : new sap.m.Label({
                        text : "Edit"
                    })
                })
            ]
        });
        jQuery.sap.require("sap.ui.core.IconPool");
        //taken from example code link in https://archive.sap.com/discussions/thread/3544906
        models.bindItems("/models", new sap.m.ColumnListItem({
            cells : [ new sap.m.Text({
                text : "{}"
                }), new sap.m.Button({
                icon : "sap-icon://edit",
            press: function(event){modelController.onEdit(event);}
            })]
          }));
        var flexbox=new sap.m.FlexBox({direction:"Column"});
        flexbox.addItem(models);
        flexbox.addItem( new sap.m.Input("idInputModelName",{value: {path: "/newModel", mode: sap.ui.model.BindingMode.TwoWay }, placeholder:"Enter Model Name"}));
        flexbox.addItem( new sap.m.Button('idButtonCreateModel',{text:"Create New Model",press: function(){modelController.onNewModel();}}));     
        flexbox.setAlignItems("Center");
        flexbox.setJustifyContent("Center");
        return new sap.m.Page("idPageModels",{
            title:"Models",
            content:flexbox
        });
    }

});