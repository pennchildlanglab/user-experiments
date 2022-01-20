var ChildlanglabAudioRecorder = {
    recording: { // some variables to hold aspects of the recording
        chunks: [],
        blob: [],
        filename: ""
    },
    trial: 0, //counter for the trial
    warning: { // text for warning messages
        browser: "Sorry, your browser does not support media recording, so this experiment will not work.",
        permission: "You must grant the experiment access to your microphone to take part."
    },

    init: function(div = "jspsych-target"){

        navigator.mediaDevices.getUserMedia( {audio: true, video: false})
        .then(stream => {this.handleAvailableData(stream)})
        .catch(error => {this.showError(this.warning.permission, div)});

    },

    handleAvailableData: function(stream){

        this.recorder = new MediaRecorder(stream); // new media recorder
        this.trial = 1; //start trial counter at 1

        // when data is available, push it to the chunks array
        this.recorder.ondataavailable = event => { 
            this.recording.chunks.push(event.data);
        };

         // resest our recording vars for the new recording
        this.recorder.onstart = event => {
            this.recording.chunks = [];
            this.recording.blob = [];
        }

        // when the recorder is stopped, create a blob from the chunks, then save
        this.recorder.onstop = event => {
            this.recording.blob = new Blob(this.recording.chunks, {type: 'audio/wav'});
            this.saveAudio(this.recording.blob, this.recording.filename)
            this.trial += 1 //increment the trial counter
            
        }
    },

    showError: function(message, div){
        // create a p and add the message; append to body
        let this_div = document.getElementById(div);
        let p = document.createElement("p");
        p.innerHTML = message;
        this_div.appendChild(p);
    },

    startRecording: function(){

        // starts the recorder
        try{
            this.recorder.start();
        } catch {
            console.log("the media recorder failed to start");
        };
    },

    stopRecording: function(filename){

        // name the file so you can save it later
        this.recording.filename = filename;

        // stops the recorder
        try{
            this.recorder.stop();
        } catch {
            console.log("the media recorder failed to stop");
        };

    },

    saveAudio: function(blob, filename){

        // create a form to send the data via post
        let form_data = new FormData();
        form_data.append("filedata", blob);
        form_data.append("filename", filename);

        // post the data to the post_media.php script
        fetch('../php/post_media.php', {
            method: 'post',
            body: form_data
        })
            .then(result => {console.log('Success:', result);})
            .catch(error => {console.error('Error:', error);});
    }
}


