sap.ui.jsview("p1942286791trial.hiadmin.view.fileEditorView", {  // this View file is called editorView.view.js within ./view/
   
    getControllerName: function() {
        return "p1942286791trial.hiadmin.controller.fileEditorController";     // the Controller lives in editorController.controller.js
    },

    createContent: function(fileEditorController) {
        var flexbox=new sap.m.FlexBox({direction:"Column"});
        //https://blogs.sap.com/2014/02/14/sapui5-javascript-and-uniqueid-definitions/
        var fileEditor = new sap.m.TextArea(this.createId("idTextAreaFileEditor"),{
            rows: 50,
            cols: 100,
            valueLiveUpdate: true,
            growing: true,
            growingMaxLines: 50,
            livechange: function(){fileEditorController.onSave();}
        });
        var modelText=new sap.m.Text("model",{text:"{/editor/model}"});
        flexbox.addItem(modelText);
        var filenameText=new sap.m.Text("filename",{text:"{/editor/filename}"});
        flexbox.addItem(filenameText);
        flexbox.addItem(fileEditor);
        flexbox.addItem( new sap.m.Button('idButtonSaveFile',{text:"Save",press: function(){fileEditorController.onSave();}}));
        flexbox.setAlignItems("Center");
        flexbox.setJustifyContent("Center");
        return new sap.m.Page("idPageFileEditor",{
            title:"File Editor",
            content:flexbox,
            showNavButton: true,
            navButtonPress: function(){fileEditorController.onBack();}
        });
    }

});