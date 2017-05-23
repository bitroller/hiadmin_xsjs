sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("p1942286791trial.hiadmin.controller.editorController", {
    onInit: function() {
        var eventBus = this.getOwnerComponent().getEventBus();
        // 1. ChannelName, 2. EventName, 3. Function to be executed, 4. Listener
        eventBus.subscribe("editor", "navigate", this.onNavigate, this);
    },
    onNavigate: function(channel, event, data) {
        var self = this;
        var userName = this.getView().getModel().getProperty("/user/name");
        this.getView().getModel().setProperty("/editor/model",data);
        $.get("db.xsjs",{action: "readModelFiles", user: userName, model: data}, function(result){
                if(result!=0){
                    //alert("models:"+result);
                    //self.getView().getModel().setProperty("/models/0",{"model":"en_template","filename":"file2.json"});
                    var modelFiles=JSON.parse(result);
                    for(var i=0;i<modelFiles.length;++i){
                        //console.log("/models/"+i+":"+modelFiles[i]);
                        self.getView().getModel().setProperty("/modelfiles/"+i,modelFiles[i]);
                    }
                }
                else{
                    alert("Nothing found!");
                }
            });
        },
    onEdit: function (event) {
        var app = sap.ui.getCore().byId("idAppHi");
        app.to("idViewFileEditor");
        var eventBus = this.getOwnerComponent().getEventBus();
        // 1. ChannelName, 2. EventName, 3. the data
        var rowContext = event.getSource().getBindingContext().getObject();
        eventBus.publish("fileEditor", "navigate", rowContext);
        },
    onBuild: function (event) {
        var self = this;
        var userName = this.getView().getModel().getProperty("/user/name");
        var model = this.getView().getModel().getProperty("/editor/model");
        var files = this.getView().getModel().getProperty("/modelfiles");
        var transferCount = 0;
        var dbFile;
        var fomaFile;
        var clickTimeStamp = Date.now();
        function readFile(fileName){
            $.ajax({
                url: "db.xsjs",
                type: "GET",
                data: {action: "readModelFile", user: userName, model: model, file: fileName},
                success: function(file){
                    $.ajax({
                        url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                        type: "POST",
                        //contentType: "application/json; charset=UTF-8",
                        data: {command: "transfer", accessKey: model, fileName: fileName, file: file, timeStamp: clickTimeStamp},
                        //headers: {"Content-Type": "application/json"},
                        success: function(){
                                ++transferCount;
                                console.log("sending file "+fileName+" was successful!");
                                if(fileName.endsWith('.sql')===true) dbFile=fileName;
                                if(fileName.endsWith('.foma')===true) fomaFile=fileName;
                            },
                        error: function(){
                                console.log("sending file "+fileName+" failed!");
                            },
                        complete: function(){
                            console.log('transferCount='+transferCount);
                            if(transferCount === files.length){
                                console.log('starting build with '+dbFile);
                                $.ajax({
                                    url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                    type: "POST",
                                    //contentType: "application/json; charset=UTF-8",
                                    data: {command: "build_src", accessKey: model, fileName: dbFile, timeStamp: clickTimeStamp},
                                    //headers: {"Content-Type": "application/json"},
                                    timeout: 900000,
                                    success: function(buildsrc_response){
                                        console.log("src build successful!");
                                        console.log(buildsrc_response);
                                        console.log('creating library');
                                        $.ajax({
                                            url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                            type: "POST",
                                            //contentType: "application/json; charset=UTF-8",
                                            data: {command: "create_lib", accessKey: model, timeStamp: clickTimeStamp},
                                            //headers: {"Content-Type": "application/json"},
                                            timeout: 900000,
                                            success: function(createlib_response){
                                                    console.log(createlib_response);
                                                    console.log("library created successfully!");
                                                    console.log('building library');
                                                    $.ajax({
                                                        url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                                        type: "POST",
                                                        //contentType: "application/json; charset=UTF-8",
                                                        data: {command: "build_lib", accessKey: model, timeStamp: clickTimeStamp},
                                                        //headers: {"Content-Type": "application/json"},
                                                        timeout: 900000,
                                                        success: function(buildlib_response){
                                                                console.log(buildlib_response);
                                                                console.log("library built successfully!");
                                                                console.log('starting build with '+fomaFile);
                                                                $.ajax({
                                                                    url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                                                    type: "POST",
                                                                    //contentType: "application/json; charset=UTF-8",
                                                                    data: {command: "build_foma", accessKey: model, fileName: fomaFile, timeStamp: clickTimeStamp},
                                                                    //headers: {"Content-Type": "application/json"},
                                                                    timeout: 900000,
                                                                    success: function(fomabuild_response){
                                                                            console.log(fomabuild_response);
                                                                            console.log("foma build successful!");
                                                                        },
                                                                    error: function(fomabuild_response){
                                                                            console.log(fomabuild_response);
                                                                            console.log("foma build failed!");
                                                                        }
                                                                    });
                                                        },
                                                        error: function(buildlib_response){
                                                                console.log(buildlib_response);
                                                                console.log("building library failed!");
                                                            }
                                                        });
                                                },
                                            error: function(createlib_response){
                                                    console.log(createlib_response);
                                                    console.log("creating library failed!");
                                            }
                                        });
                                    },
                                    error: function(buildsrc_response){
                                            console.log(buildsrc_response);
                                            console.log("src build failed!");
                                    }
                                });
                            }
                        }
                    });
                },
                error: function(){
                    console.log("error reading file: "+fileName);
                }
            });
        }
        function buildFile(fileName){
            $.ajax({
                url: "db.xsjs",
                type: "GET",
                data: {action: "readModelFile", user: userName, model: model, file: fileName},
                success: function(file){
                    $.ajax({
                        url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                        type: "POST",
                        //contentType: "application/json; charset=UTF-8",
                        data: {command: "transfer", accessKey: model, fileName: fileName, file: file, timeStamp: clickTimeStamp},
                        //headers: {"Content-Type": "application/json"},
                        success: function(){
                                ++transferCount;
                                console.log("sending file "+fileName+" was successful!");
                                if(fileName.endsWith('.sql')===true) dbFile=fileName;
                                if(fileName.endsWith('.foma')===true) fomaFile=fileName;
                            },
                        error: function(){
                                console.log("sending file "+fileName+" failed!");
                            },
                        complete: function(){
                            if(transferCount === files.length){
                                console.log('starting build');
                                (function poll_build_src() {
                                    setTimeout(function() {
                                        $.ajax({
                                            url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                            type: "POST",
                                            //contentType: "application/json; charset=UTF-8",
                                            data: {command: "build_src", accessKey: model, fileName: dbFile, timeStamp: clickTimeStamp},
                                            //headers: {"Content-Type": "application/json"},
                                            error: function(xhr_build_src,textStatus_build_src,errorThrown_build_src){
                                                    console.log(errorThrown_build_src);
                                                    console.log("src build failed!");
                                            },
                                            complete: function(xhr_build_src,textStatus_build_src){
                                                if(xhr_build_src.status === 202){
                                                    poll_build_src();
                                                }
                                                else if(xhr_build_src.status === 200){
                                                    console.log("src build successful!");
                                                    console.log('creating library');
                                                    (function poll_create_lib() {
                                                        setTimeout(function() {
                                                            $.ajax({
                                                                url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                                                type: "POST",
                                                                //contentType: "application/json; charset=UTF-8",
                                                                data: {command: "create_lib", accessKey: model, timeStamp: clickTimeStamp},
                                                                //headers: {"Content-Type": "application/json"},
                                                                error: function(xhr_create_lib,textStatus_create_lib,errorThrown_create_lib){
                                                                        console.log(errorThrown_create_lib);
                                                                        console.log("creating library failed!");
                                                                },
                                                                complete: function(xhr_create_lib,textStatus_create_lib){
                                                                    if(xhr_create_lib.status === 202){
                                                                        poll_create_lib();
                                                                    }
                                                                    else if(xhr_create_lib.status === 200){
                                                                        console.log("library created successfully!");
                                                                        console.log('building library');
                                                                        (function poll_build_lib() {
                                                                            setTimeout(function() {
                                                                                $.ajax({
                                                                                    url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                                                                    type: "POST",
                                                                                    //contentType: "application/json; charset=UTF-8",
                                                                                    data: {command: "build_lib", accessKey: model, timeStamp: clickTimeStamp},
                                                                                    //headers: {"Content-Type": "application/json"},
                                                                                    error: function(xhr_build_lib,textStatus_build_lib,errorThrown_build_lib){
                                                                                            console.log(errorThrown_build_lib);
                                                                                            console.log("building library failed!");
                                                                                    },
                                                                                    complete: function(xhr_build_lib,textStatus_build_lib){
                                                                                        if(xhr_build_lib.status === 202){
                                                                                            poll_build_lib();
                                                                                        }
                                                                                        else if(xhr_build_lib.status === 200){
                                                                                            console.log("library built successfully!");
                                                                                            console.log('starting build with '+fomaFile);
                                                                                            (function poll_build_foma() {
                                                                                                setTimeout(function() {
                                                                                                    $.ajax({
                                                                                                        url: "https://ec2-35-160-136-134.us-west-2.compute.amazonaws.com/hi",
                                                                                                        type: "POST",
                                                                                                        //contentType: "application/json; charset=UTF-8",
                                                                                                        data: {command: "build_foma", accessKey: model, fileName: fomaFile, timeStamp: clickTimeStamp},
                                                                                                        //headers: {"Content-Type": "application/json"},
                                                                                                        error: function(xhr_build_foma,textStatus_build_foma,errorThrown_build_foma){
                                                                                                                console.log(textStatus_build_foma);
                                                                                                                console.log("foma build failed!");
                                                                                                        },
                                                                                                        complete: function(xhr_build_foma,textStatus_build_foma){
                                                                                                            if(xhr_build_foma.status === 202){
                                                                                                                poll_build_foma();
                                                                                                            }
                                                                                                            else if(xhr_build_foma.status === 200){
                                                                                                                console.log("foma build successful!");
                                                                                                            }
                                                                                                        }
                                                                                                    });
                                                                                                }, 30000);
                                                                                            })();
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }, 30000);
                                                                        })();
                                                                    }
                                                                }
                                                            });
                                                        }, 30000);
                                                    })();
                                                }
                                            }
                                        });
                                    }, 30000);
                                })();
                            }
                        }
                    });
                },
                error: function(){
                    console.log("error reading file: "+fileName);
                }
            });
        }
        for(var i=0;i<files.length;++i){
            //readFile(files[i]);
            buildFile(files[i]);
        }
    },
    onBack: function(event){
        var self = this;
        this.getView().getModel().setProperty("/modelfiles",{});
        var newModel = this.getView().getModel().getProperty("/newModel");
        var userName = this.getView().getModel().getProperty("/user/name");
        if(newModel.length>0){
            this.getView().getModel().setProperty("/newModel","");
            $.get("db.xsjs",{action: "readModels", user: userName}, function(models){
                if(models!=0){
//                  alert("result is:"+models);
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
        }
        var app = sap.ui.getCore().byId("idAppHi");
        app.to("idViewModels");
        }
    });
});