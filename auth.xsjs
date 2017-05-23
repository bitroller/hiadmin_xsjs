function createUser(userName, password){
    var userStore = $.security.Store("users.xssecurestore");
    userStore.store({name: userName, value: password});
    //"insert into \"users\" values ('r0ller@freemail.hu','l','l');"
    return "user created";
}

function logonUser(userName, password){
    var userStore = $.security.Store("users.xssecurestore");
    var key = userStore.read({name: userName});
    if(password===key){
        return true;
    }
    else{
        return false;
    }
}

var result;
var user;
var pw;
var action = $.request.parameters.get('action');
switch (action){
    case "create":
        user = $.request.parameters.get('user');
        pw = $.request.parameters.get('pw');
        result = createUser(user,pw);
        break;
    case "logon":
        user = $.request.parameters.get('user');
        pw = $.request.parameters.get('pw');
        result = logonUser(user,pw);
        break;
    default:
        $.response.status = $.net.http.BAD_REQUEST;
        $.response.setBody('Invalid Command');
}
$.response.setBody(result);