/**
 * Created by zhengtang on 17-1-3.
 */

// variables
var leftchannel = [];
var rightchannel = [];
var recorder = null;
var recording = false;
var recordingLength = 0;
var volume = null;
var audioInput = null;
var sampleRate = null;
var audioContext = null;
var context = null;
//var outputString;

function soaros_recorder_init ()
{
    navigator.mediaDevices.getUserMedia({audio: true})
       .then(success)
       .catch(function (err) {
          console.log(err.name + ": " + err.message);});
}

// if R is pressed, we start recording

function soaros_recorder_start(){
    if (recorder != null) {
        recording = true;
        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;

        console.log("soaros_recorder_start");
        return 0;
    }
    else
    {
        return 1;
    }
}

function soaros_recorder_stop(feild){

    if (recorder == null) {
        return 1;
    }
    // we stop recording
    recording = false;

    // we flat the left and right channels down
    var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
    var rightBuffer = mergeBuffers ( rightchannel, recordingLength );
    // we interleave both channels together
    var interleaved = interleave ( leftBuffer, rightBuffer );

    // we create our wav file
    var buffer = new ArrayBuffer(44 + interleaved.length * 2);


    var view = new DataView(buffer);

    // RIFF chunk descriptor
    writeUTFBytes(view, 0, 'RIFF');
    view.setUint32(4, 44 + interleaved.length * 2, true);
    writeUTFBytes(view, 8, 'WAVE');
    // FMT sub-chunk
    writeUTFBytes(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    // stereo (2 channels)
    view.setUint16(22, 2, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    // data sub-chunk
    writeUTFBytes(view, 36, 'data');
    view.setUint32(40, interleaved.length * 2, true);

    // write the PCM samples
    var lng = interleaved.length;
    var index = 44;
    var volume = 1;
    for (var i = 0; i < lng; i++){
        view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
        index += 2;
    }

    var blob = new Blob ( [ view ], { type : 'audio/mpeg' } );

    // android chrome audio不支持blob
    var reader = new FileReader();
    reader.onload = function(event){
       // var myAudio = document.getElementsByClassName('my-audio')[0];
       // var audio = window.document.createElement('audio');
        /*var fso, f1;
        fso = new ActiveXObject("Scripting.FileSystemObject");
        f1 = fso.CreateTextFile("temp.wav", true);
        f1.write(event.target.result);*/
        //var recordFile = new File();
        uploadDataToServer("http://10.50.10.167:3000/upload", event.target.result, "record.wav", "audio/mpeg", soaros_getHashFromResponse, feild);

    };
    // 转换base64
    //reader.readAsDataURL(blob);
    reader.readAsBinaryString(blob);

    return 0;
}

function soaros_getHashFromResponse(res, field) {
    if (res === null)
    {
        return;
    }
    var hash = res;
    var definedhash = "\"hash\":\"";
    var index = hash.lastIndexOf(definedhash);
    if (index > 0) {
        hash.substr(index+definedhash.length, hash.length-1);
        field.setValue(hash);
    }
}

function soaros_recorder_play() {

}


function interleave(leftChannel, rightChannel){
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length; ){
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
}

function mergeBuffers(channelBuffer, recordingLength){
    var result = new Float32Array(recordingLength);
    var offset = 0;
    var lng = channelBuffer.length;
    for (var i = 0; i < lng; i++){
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
}

function writeUTFBytes(view, offset, string){
    var lng = string.length;
    for (var i = 0; i < lng; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function success(e){
// creates the audio context
    console.log("success");
    audioContext = window.AudioContext || window.webkitAudioContext;
    context = new audioContext();

    // we query the context sample rate (varies depending on platforms)
    sampleRate = context.sampleRate;

    console.log('succcess');

    // creates a gain node
    volume = context.createGain();

    // creates an audio node from the microphone incoming stream
    audioInput = context.createMediaStreamSource(e);

    // connect the stream to the gain node
    audioInput.connect(volume);

    /* From the spec: This value controls how frequently the audioprocess event is
     dispatched and how many sample-frames need to be processed each call.
     Lower values for buffer size will result in a lower (better) latency.
     Higher values will be necessary to avoid audio breakup and glitches */
    var bufferSize = 2048;
    recorder = context.createScriptProcessor(bufferSize, 2, 2);

    recorder.onaudioprocess = function(e){
        if (!recording) return;
        var left = e.inputBuffer.getChannelData (0);
        var right = e.inputBuffer.getChannelData (1);
        // we clone the samples
        leftchannel.push (new Float32Array (left));
        rightchannel.push (new Float32Array (right));
        recordingLength += bufferSize;
        console.log('recording');
    }

    // we connect the recorder
    volume.connect (recorder);
    recorder.connect (context.destination);
}