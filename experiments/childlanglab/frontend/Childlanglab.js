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

    insertRun: function(){

        // inserts the run to the database (new db row)
        fetch('../childlanglab/backend/insert_run.php', {
            method: 'post',
            body: JSON.stringify(this.run),
        })
        .then(result => {console.log('Success:', result);})
        .catch(error => {console.error('Error:', error);});
    },

    updateRun: function(data){

        // updates the run in the database (updates the randomid's data column)
        fetch('../childlanglab/backend/update_run.php', {
            method: 'post',
            body: JSON.stringify( {
                    json_data: data,
                    randomid: this.run.randomid
                })
        })
        .then(result => {console.log('Success:', result);})
        .catch(error => {console.error('Error:', error);});
    }
}