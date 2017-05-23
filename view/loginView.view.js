// sap.ui.define([
//   "sap/ui/core/mvc/JSView"
// ], function (View) {
//   "use strict";
//   return View.extend("view.loginView", {
sap.ui.jsview("p1942286791trial.hiadmin.view.loginView", {// this View file is called loginView.view.js within ./view/
    getControllerName: function() {
        return "p1942286791trial.hiadmin.controller.loginController";     // the Controller lives in loginController.controller.js
    },

    createContent: function(loginController) {
        var flexbox=new sap.m.FlexBox({direction:"Column"});
        flexbox.addItem( new sap.m.Input("idInputName",{value: {path: "/user/name", mode: sap.ui.model.BindingMode.TwoWay }, placeholder:"Enter UserName"}));
        flexbox.addItem( new sap.m.Input("idInputPassword",{value: {path: "/user/password", mode: sap.ui.model.BindingMode.TwoWay }, type: sap.m.InputType.Password, placeholder:"Enter Password"}));
        flexbox.addItem( new sap.m.Button('idButtonLogin',{text:"Log In",press: function(){loginController.onLogin();}}));     
        flexbox.setAlignItems("Center");
        flexbox.setJustifyContent("Center");
                     
        return new sap.m.Page("idPageLogin",{
            title: "Hi",
            content: flexbox
            });
        }
});
//});