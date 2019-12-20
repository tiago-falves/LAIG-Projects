class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

    };

    /**
     * MyGameOrchestrator Display function. Displays all the MyGameOrchestrator cells and registers them for picking.
     */
    display() {
        var degToRad = Math.PI / 180;

        this.theme.display();
        this.gameboard.display();
        this.animator.display();
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){
            if (results != null && results.length > 0) { // any results?
                for (var i=0; i< results.length; i++) {
                    var obj = pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = pickResults[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    onObjectSelected(obj, id) {
        if(obj instanceof ChameleonPiece){
            // do something with id knowing it is a piece
        }
        else{
            if(obj instanceof BoardCell){
                // do something with id knowing it is a tile
            }
        }   
    }
    
    
    update(time) {
        this.animator.update(time);
    }


    updateTexCoords(length_s,length_t) {};

}



    




