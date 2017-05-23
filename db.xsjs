function readModelFiles(username, modelname){
    //.xssqlcc: to make null auth work, getConnection() needs the sql config name in “_SYS_XS”.”SQL_CONNECTIONS” table
    //note that once the pw is changed for the user set in sqlcc, it probably also needs to be changed in the xsadmin tool
    var conn = $.db.getConnection("p1942286791trial.hiadmin::");
    var content='[';
    try{
        var pstmt = conn.prepareStatement( "select filename from \"modelfiles\" where user = '"+username+"' and model = '"+modelname+"';" );
        var rs = pstmt.executeQuery();
        while(rs.next()){
            content = content+'"'+rs.getString(1)+'",';
        }
        if(content.length>1){
            content = content.substring(0, content.length - 1) + ']';
        }
        else{
            content = "";
        }
    }
    catch(e){
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody(e.message);
    }
    rs.close();
    pstmt.close();
    conn.close();
    return content;
}

function readModelFile(username, modelname, filename){
    var conn = $.db.getConnection("p1942286791trial.hiadmin::");
    var content="";
    try{
        var pstmt = conn.prepareStatement( "select file from \"modelfiles\" where user = '"+username+"' and model = '"+modelname+"' and filename = '"+filename+"';" );
        var rs = pstmt.executeQuery();
        while(rs.next()){
            content = rs.getString(1);
        }
    }
    catch(e){
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody(e.message);
    }
    rs.close();
    pstmt.close();
    conn.close();
    return content;
}

function readModels(username){
    var conn = $.db.getConnection("p1942286791trial.hiadmin::");
    var content='[';
    try{
        var pstmt = conn.prepareStatement( "select model from \"models\" where user = '"+username+"';" );
        var rs = pstmt.executeQuery();
        while(rs.next()){
            content = content+'"'+rs.getString(1)+'",';
        }
        if(content.length>1){
            content = content.substring(0, content.length - 1) + ']';
        }
        else{
            content = "";
        }
    }
    catch(e){
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody(e.message);
    }
    rs.close();
    pstmt.close();
    conn.close();
    return content;
}

function writeModelFile(username, modelname, filename, content){
    var conn = $.db.getConnection("p1942286791trial.hiadmin::");
    try{
        var pstmt = conn.prepareStatement( "update \"modelfiles\" set file = '"+content+"' where user = '"+username+"' and model = '"+modelname+"' and filename = '"+filename+"';" );
        var rs = pstmt.executeUpdate();//rs shows only the number of changed rows->no need to close later
        conn.commit();
    }
    catch(e){
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody(e.message);
    }
    pstmt.close();
    conn.close();
    return true;
}

function writeModel(username, modelname){
    var conn = $.db.getConnection("p1942286791trial.hiadmin::");
    try{
        var sql = "insert into \"models\" values ('"+username+"', '"+modelname+"');";
        var pstmt = conn.prepareStatement(sql);
        var rs = pstmt.executeUpdate();
        conn.commit();
        sql = "insert into \"modelfiles\" values ('"+username+"', '"+modelname+"', 'phonology.foma', '');";
        pstmt = conn.prepareStatement(sql);
        rs = pstmt.executeUpdate();
        conn.commit();
        sql = "insert into \"modelfiles\" values ('"+username+"', '"+modelname+"', 'noun_morphology.lexc', '');";
        pstmt = conn.prepareStatement(sql);
        rs = pstmt.executeUpdate();
        conn.commit();
        sql = "insert into \"modelfiles\" values ('"+username+"', '"+modelname+"', 'nonspec_morphology.lexc', '');";
        pstmt = conn.prepareStatement(sql);
        rs = pstmt.executeUpdate();
        conn.commit();
        sql = "insert into \"modelfiles\" values ('"+username+"', '"+modelname+"', 'content.sql', '');";
        pstmt = conn.prepareStatement(sql);
        rs = pstmt.executeUpdate();
        conn.commit();
    }
    catch(e){
            $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
            $.response.setBody(e.message);
    }
    pstmt.close();
    conn.close();
    $.response.status = $.net.http.OK;
    return true;
}

var user;
var model;
var file;
var filecontent;
var result;
var action;
//if($.request.method === $.net.http.GET){
    action = $.request.parameters.get('action');
    switch (action){
        case "readModels":
            user = $.request.parameters.get('user');
            result = readModels(user);
            break;
        case "readModelFile":
            user = $.request.parameters.get('user');
            model = $.request.parameters.get('model');
            file = $.request.parameters.get('file');
            result = readModelFile(user,model,file);
            break;
        case "readModelFiles":
            user = $.request.parameters.get('user');
            model = $.request.parameters.get('model');
            result = readModelFiles(user,model);
            break;
//        default:
//            $.response.status = $.net.http.BAD_REQUEST;
//            $.response.setBody('Invalid Command');
//    }
    //$.response.setBody(result);
//}
//else if($.request.method === $.net.http.POST){
//    switch (action){
        case "writeModelFile":
            user = $.request.parameters.get('user');
            model = $.request.parameters.get('model');
            file = $.request.parameters.get('file');
            filecontent = $.request.parameters.get('filecontent');
            result = writeModelFile(user,model,file,filecontent);
            break;
        case "writeModel":
            user = $.request.parameters.get('user');
            model = $.request.parameters.get('model');
            result = writeModel(user,model);
            break;
        default:
            $.response.status = $.net.http.BAD_REQUEST;
            $.response.setBody('Invalid Command');
    }
    $.response.setBody(result);
//}
