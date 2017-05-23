sap.ui.jsview("p1942286791trial.hiadmin.view.editorView", {  // this View file is called editorView.view.js within ./view/
   
    getControllerName: function() {
        return "p1942286791trial.hiadmin.controller.editorController";     // the Controller lives in editorController.controller.js
    },

    createContent: function(editorController) {
        var modelFiles = new sap.m.Table("modelFiles", {   
            headerText : "Model Files",
            headerDesign : sap.m.ListHeaderDesign.Standard,
            mode : sap.m.ListMode.None,
            includeItemInSelection : false,
            columns: [
                new sap.m.Column({
                    width : "1em",
                    header : new sap.m.Label({
                        text : "File Name"
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
        modelFiles.bindItems("/modelfiles", new sap.m.ColumnListItem({
            cells : [ new sap.m.Text({
                text : "{}"
                }), new sap.m.Button({
                icon : "sap-icon://edit",
            press: function(event){editorController.onEdit(event);}
            })]
          }));
        var flexbox=new sap.m.FlexBox({direction:"Column"});
        var modelText=new sap.m.Text("modelInEditor",{text:"{/editor/model}"});
        flexbox.addItem(modelText);
        flexbox.addItem(modelFiles);
        flexbox.addItem( new sap.m.Button('idButtonBuild',{text:"Build",press: function(){editorController.onBuild();}}));
        flexbox.setAlignItems("Center");
        flexbox.setJustifyContent("Center");
        return new sap.m.Page("idPageEditor",{
            title:"Editor",
            content:flexbox,
            showNavButton: true,
            navButtonPress: function(){editorController.onBack();}
        });
    }

});