sap.ui.define([
   "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("p1942286791trial.hiadmin.controller.loginController", {
    onLogin: function () {
        var self = this;
        var userName = this.getView().getModel().getProperty("/user/name");
        var pw = this.getView().getModel().getProperty("/user/password");
        $.get("auth.xsjs",{action: "logon", user: userName, pw: pw}, function(result){    
            if(result == true){
                $.get("db.xsjs",{action: "readModels", user: userName}, function(models){
                    if(models!=0){
//                        alert("result is:"+models);
                        var modelArray=JSON.parse(models);
                        for(var i=0;i<modelArray.length;++i){
                            //console.log("/models/"+i+":"+modelArray[i]);
                            self.getView().getModel().setProperty("/models/"+i,modelArray[i]);
                        }
                    }
                    else{
                        alert("nothing found!");
                    }
                });
                var app = sap.ui.getCore().byId("idAppHi");
                app.to("idViewModels");
                }
            });
        }
    });
});