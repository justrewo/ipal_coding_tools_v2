import {HTTP} from "@ionic-native/http";
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Platform} from "ionic-angular";
import {File} from "@ionic-native/file";

export class DeviceUtility {
    private uuid:string = null;
    private url:string;
    private content:string;
    private http:HTTP = new HTTP();
    private transfer:FileTransfer = new FileTransfer();
    private platform:Platform = new Platform();
    private file:File = new File();

    constructor(url:string, content:string) {
        this.url = url;
        this.content = content;
    }

    private getFileDirectory() {
		if (this.platform.is("ios")) {
			return this.file.documentsDirectory;
		} else {
			return this.file.externalDataDirectory;
		}
    }

    private getFileName() {
		return 'runcode.rs';
    }
    
	private getFilePath() {
		if (this.platform.is("ios")) {
			let tmp_path = this.getFileDirectory() + this.getFileName();
			return tmp_path.replace(/^file:\/\//,"");
		} else {
			return this.getFileDirectory() + this.getFileName();
		}
	}

	private getFilePathRaw() {
		let tmp_path = this.getFileDirectory() + this.getFileName();
		return tmp_path.replace(/^file:\/\//,"");
	}
    
    public uploadDataToServer(filename, type, callback, userdata) {
        let that = this;
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.url + "upload", true);
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=---------------------------5081957846815694751082490309");
    
        var body = "-----------------------------5081957846815694751082490309\r\nContent-Disposition: form-data; name=\"fileUploaded\"; filename=\"" + filename + "\"\r\nContent-Type: " + type + "\r\n\r\n" + this.content + "\r\n\r\n-----------------------------5081957846815694751082490309--\r\n";
    
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
                    that.startRunScript(JSON.parse(xhr.responseText).hash);
                }
            }
        }
        

        /*
        this.file.createFile(this.getFileDirectory(), this.getFileName(), true);
        this.file.writeExistingFile(this.getFileDirectory(), this.getFileName(), this.content);

        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: filename,
            mimeType: "multipart/form-data",
            params: {
                fileUploaded:this.content
            },
            headers: {}
         }

         let filetransfer = this.transfer.create();
         filetransfer.upload(this.getFileDirectory(), this.url + "upload", options, true).then((data)=>{
            console.log("wangjun" + "aaaaaa");
         }, (err)=>{
            console.log("wangjunkkk" + err);
         });
         */
    }

    private startRunScript(hash) {
        let that = this;
        if(this.uuid) {
            return;
        }
    
        let req = {
            controlCode: "1",
            hash: hash
        };
    
        console.log("--- hash value is " + hash + " ---");
        this.http.post(this.url + "control", req, {}).then(data => {
            let res = JSON.parse(data.data);
            if(res.result == 'OK') {
                that.uuid = res.uuid;
                setTimeout(()=>{that.kick_robot}, 200);
            }
        }).catch(err => {
            console.log(err);
        });
        /*
        $.ajax({
            type: 'post',
            data: JSON.stringify(req),
            contentType: 'application/json',
            url: "/control",
            success: function(data) {
                if(data.result == 'OK') {
                    that.uuid = data.uuid;
                    setTimeout(that.kick_robot, 200);
                }
            }
        });
        */
    }

    private kick_robot() {
        let that = this;
        if (!this.uuid) {
            return;
        }
    
        let req = {
            controlCode: "2",
            uuid: this.uuid
        };
    
        this.uuid = null;
        this.http.post(this.url + "control", req, {}).then(data => {
            let res = JSON.parse(data.data);
            if(res.result == "OK" || res.result == "DONE") {
                if(res.result == "OK") {
                    that.uuid = req.uuid;
                    setTimeout(()=>{that.kick_robot}, 200);
                }
            }
        }).catch(err => {
            console.log(err);
        });
        /*
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
        */
    }
}