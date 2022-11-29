var Childlanglab = {
    run: {},// holds the url variables 

    init: function({consent_url = ''} = {}) {
        return new Promise((resolve, reject) => {

            this.getURLVars()
            .then( run => { return this.assignRandomId(); })
            .then( id => { return this.getConsent(consent_url); })
            .then( consent => { return this.insertRun()})
            // here add demographic survey and prolific prescreener
            .then( response => {
                if (this.run) {
                    console.log("Childlanglab: starting experiment!"); 
                    console.log(this.run);
                    resolve(this.run);
                } else {
                    reject("Childlanglab failed to initialize");
                }    
            })
            .catch( err => { reject(err); })
        })
    },

    getURLVars: function() {
        return new Promise((resolve, reject) => {
            // If browser supports URL search params, get them and generate the run
            if ('URLSearchParams' in window){
                let params = new URLSearchParams(window.location.search);
                this.run = Object.fromEntries(params);
                console.log('Childlanglab: retrieving URL parameters')
                resolve(this.run);
            } else {
                reject(" Childlanglab cannot retrieve url vars, your browser does not support URLSearchParams... ");
            }
        })
    },

    assignRandomId: function() {
        return new Promise((resolve, reject) => {

            if (true) {
                console.log('Childlanglab: assigning randomid')
                this.run['randomid'] = '_' + Math.random().toString(36).substr(2, 12);
                resolve(this.run.randomid);
            } else {
                reject("Childlanglab cannot assign random id")
            }
        })
    },

    getConsent: function(url){

        return new Promise((resolve, reject) => {
            console.log('Childlanglab: requesting participant consent')

            // add the style sheet for the consent document 
            let link = document.createElement('link');
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "https://childlanglab.com/consents/assets/css/style.css";
            document.head.appendChild(link);

            // add a div for the consent form so we can remove it later
            let consent = document.createElement('div');
            consent.id = 'consent';
            //consent.setAttribute('class', 'jspsych-content');
            document.body.appendChild(consent);

            fetch(url)
                .then(response => response.text())
                .then(html => { consent.innerHTML = html;})
                .then(show => {

                    // add a div for the button so it looks nicer 
                    let div = document.createElement('div');
                    div.setAttribute('class', 'jspsych-content');
                    consent.appendChild(div);

                    // add a button to click
                    let btn = document.createElement("input");
                    btn.setAttribute('value', 'Start Experiment');
                    btn.setAttribute('type', 'button');
                    btn.setAttribute('class', 'jspsych-btn');
                    div.appendChild(btn);

                    // add event listener to wait for click 
                    btn.onclick = function(){
                        consent.innerHTML = '';
                        document.body.removeChild(consent);
                        document.head.removeChild(link);
                        resolve('consented')
                    }  
                })
        })
    },

    getDemographics: function(){
        // placeholder for future function to get lab's demographic survey
        return new Promise((resolve) => {
            console.log('Childlanglab: delivering demographics survey')
            resolve('demographics');

        })
    },

    prescreenProlific: function(){
        // placeholder for future function to get lab's prolific prescreener
        return new Promise((resolve) => {
            console.log('Childlanglab: delivering prolific prescreener')
            resolve('prescreener');
        })
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

    saveData: function(data){

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

    saveRecording: function(base64_audio, filename){
        // create build path for filename
        let path = this.run.project+'/'+this.run.randomid+'/'+filename+'.webm';
        console.log('saving data as '+path);

        // create a form to send the data via post
        let form_data = new FormData();
        form_data.append("base64_audio", base64_audio);
        form_data.append("filename", path);
        form_data.append("project", this.run.project);
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