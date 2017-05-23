sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("p1942286791trial.hiadmin.controller.modelController", {
    onEdit: function (event) {
            var app = sap.ui.getCore().byId("idAppHi");
            app.to("idViewEditor");
            var eventBus = this.getOwnerComponent().getEventBus();
            // 1. ChannelName, 2. EventName, 3. the data
            var rowContext = event.getSource().getBindingContext().getObject();
            eventBus.publish("editor", "navigate", rowContext);
        },
    onNewModel: function (event) {
            var self = this;
            var userName = this.getView().getModel().getProperty("/user/name");
            var model = this.getView().getModel().getProperty("/newModel");
            $.ajax({
                url: "db.xsjs",
                type: "POST",
                data: {action: "writeModel", user: userName, model: model},
                success: function(result){
                        //alert("result:"+result);
                        var app = sap.ui.getCore().byId("idAppHi");
                        app.to("idViewEditor");
                        var eventBus = self.getOwnerComponent().getEventBus();
                        // 1. ChannelName, 2. EventName, 3. the data
                        eventBus.publish("editor", "navigate", model);
                },
                error: function(result){
                    alert("error: "+result);
                }
            });
        }
    });
});