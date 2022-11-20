var Childlanglab = {
    run: {},// holds the url variables 

    init: function() {
        return new Promise((resolve, reject) => {

            this.getURLVars()
            .then( run => { return this.assignRandomId(); })
            .then( id => { 
                if (this.run) {
                    console.log("Childlanglab Database initalized succesfully..."); 
                    console.log(this.run);
                    resolve(this.run);
                } else {
                    reject("Childlanglab Database failed to initialize... ");
                }    
            })
            .catch( err => { reject(err); })
        })
    },

    getURLVars: function() {
        return new Promise((resolve, reject) => {
            // If browser supposrts URL search params, get them and generate the run
            if ('URLSearchParams' in window){
                let params = new URLSearchParams(window.location.search);
                this.run = Object.fromEntries(params);
                resolve(this.run);
            } else {
                reject(" Childlanglab cannot retrieve url params, your browser does not support URLSearchParams... ");
            }
        })
    },

    assignRandomId: function() {
        return new Promise((resolve, reject) => {

            if (true) {
                this.run['randomid'] = '_' + Math.random().toString(36).substr(2, 12);
                resolve(this.run.randomid);
            } else {
                reject("Childlanglab cannot assign random id")
            }
        })
    },

    checkConsent: function(){
        var checkbox = document.getElementById('consent_checkbox')
        if (checkbox.checked){
            return true;
        } else {
            alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'")
            return false;
        }
        return false;
    },

    insertRun: function(){

        // inserts the run to the database (new db row)
        fetch('../../childlanglab/backend/insert_run.php', {
            method: 'post',
            body: JSON.stringify(this.run),
        })
        .then(result => {console.log('Success:', result);})
        .catch(error => {console.error('Error:', error);});
    },

    updateRun: function(data){

        // updates the run in the database (updates the randomid's data column)
        fetch('../../childlanglab/backend/update_run.php', {
            method: 'post',
            body: JSON.stringify( {
                    json_data: data,
                    randomid: this.run.randomid
                })
        })
        .then(result => {console.log('Success:', result);})
        .catch(error => {console.error('Error:', error);});
    },

    saveAudio: function(base64_audio, filename){
        // create build path for filename
        let path = this.run.project+'/'+this.run.randomid+'/'+filename+'.webm';
        console.log('saving data as '+path);

        // create a form to send the data via post
        let form_data = new FormData();
        form_data.append("base64_audio", base64_audio);
        form_data.append("filename", path);
        form_data.append("randomid", this.run.randomid);

        // post the data to the post_media.php script
        fetch('../../childlanglab/backend/post_media.php',
        {
            method: 'post',
            body: form_data
        })
            .then(result => {console.log('Success:', result);})
            .catch(error => {console.error('Error:', error);});
    }

    
}