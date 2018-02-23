/**
 * Created by zhengtang on 17-1-6.
 */
function uploadDataToServer(url, content, filename, type, callback, userdata) {
    var xhr = new XMLHttpRequest();
    xhr.open(/* method */ "POST", url, true, "admin", "admin");
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------5081957846815694751082490309");

    var body = "-----------------------------5081957846815694751082490309\r\nContent-Disposition: form-data; name=\"fileUploaded\"; filename=\"" + filename + "\"\r\nContent-Type: " + type + "\r\n\r\n" + content + "\r\n\r\n-----------------------------5081957846815694751082490309--\r\n";

    xhr.send(body);
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log("upload complete");
                console.log("response: " + xhr.responseText);
                if (callback)
                {
                    callback(xhr.responseText, userdata);
                }
                startRunScript(JSON.parse(xhr.responseText).hash);
            }
        }
    }
}

var uuid = null;

function startRunScript(hash) {
    if(uuid)
        return;

    var req = {};
    req.controlCode = "1";
    req.hash = hash;

    console.log("--- hash value is " + hash + " ---");
    $.ajax({
        type: 'post',
        data: JSON.stringify(req),
        contentType: 'application/json',
        url: "/control",
        success: function(data) {
            if(data.result == 'OK') {
                uuid = data.uuid;
                setTimeout(kick_robot, 200);
            }
        }
    });
}

function kick_robot() {
    if(!uuid)
        return;

    var req = {};
    req.controlCode = "2";
    req.uuid = uuid;

    uuid = null;
    $.ajax({
        type: 'post',
        data: JSON.stringify(req),
        contentType: 'application/json',
        url: "/control",
        success: function(data) {
            if(data.result == "OK" || data.result == "DONE") {
                if(data.result == "OK") {
                    uuid = req.uuid;
                    setTimeout(kick_robot, 200);
                }
            }
        }
    });
}