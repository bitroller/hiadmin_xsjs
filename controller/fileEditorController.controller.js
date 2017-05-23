sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("p1942286791trial.hiadmin.controller.fileEditorController", {
        onInit : function() {
            var eventBus = this.getOwnerComponent().getEventBus();
            // 1. ChannelName, 2. EventName, 3. Function to be executed, 4. Listener
            eventBus.subscribe("fileEditor", "navigate", this.onNavigate, this);
        },
        onNavigate : function(channel, event, data) {
            var self = this;
            var userName = this.getView().getModel().getProperty("/user/name");
            var model = this.getView().getModel().getProperty("/editor/model");
            this.getView().getModel().setProperty("/editor/filename",data);
            $.get("db.xsjs",{action: "readModelFile", user: userName, model: model, file: data}, function(result){
                    if(result!=0){
                        //alert("content:"+result);
                        self.getView().byId("idTextAreaFileEditor").setValue(result);
                    }
                    else{
                        var file = new JSONModel("model/"+data);
                        file.attachRequestCompleted(function() {
                            self.getView().byId("idTextAreaFileEditor").setValue(file.getJSON());
                        });
                    }
                });
        },
        onSave: function(){
            var userName = this.getView().getModel().getProperty("/user/name");
            var model = this.getView().getModel().getProperty("/editor/model");
            var fileName = this.getView().getModel().getProperty("/editor/filename");
            var fileContent = this.getView().byId("idTextAreaFileEditor").getValue();
            fileContent = fileContent.split("'").join("\'\'");
            $.post("db.xsjs",{action: "writeModelFile", user: userName, model: model, file: fileName, filecontent: fileContent}, function(result){
                    if(result==true){
                        alert("file saved!");
                    }
                    else{
                        alert("error: "+result);
                    }
                });
        },
        onBack: function(event){
            var app = sap.ui.getCore().byId("idAppHi");
            app.to("idViewEditor");
        }
    });
});