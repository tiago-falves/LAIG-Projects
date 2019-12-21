class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);
        this.scene;


        this.board = new MyGameBoard(this.scene);
        this.gameStates = {
            START: 0,
            START_PLAY: 1,
            MOVING_PIECE: 2,
            GAME_OVER: 3
        };

        //Testing
        this.currentState = this.gameStates.START_PLAY;

    };

    /**
     * MyGameOrchestrator Display function. Displays all the MyGameOrchestrator cells and registers them for picking.
     */
    display() {
        var degToRad = Math.PI / 180;
        this.board.display();

        // this.theme.display();
        // this.gameboard.display();
        // this.animator.display();
    }

    onObjectSelected(obj, id) {
        if(obj instanceof ChameleonPiece){
            // do something with id knowing it is a piece
            console.log("Picked object: " + obj + ", with pick id " + customId);										

        }
        else{
            if(obj instanceof BoardCell){
                // do something with id knowing it is a tile
                if(this.currentState == this.gameStates.START_PLAY){
                    console.log("Picked object: " + obj + ", with pick id " + id);		
                    this.originPos = obj.getRowColumn();
                    console.log("MOVING PIECE row: " + this.originPos[0] + " col: " + this.originPos[1]);		

                    this.currentState = this.gameStates.MOVING_PIECE
                } else if (this.currentState == this.gameStates.MOVING_PIECE){
                        console.log("Moved PIECE to row: " + obj.row + " col: " + obj.col);		

                        this.board.movePiece(this.originPos[0],this.originPos[1],obj.row,obj.col);
                        this.currentState = this.gameStates.START_PLAY;



                }					

            }
        }   
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){
            if (results != null && results.length > 0) { // any results?
                for (var i=0; i< results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = results[i][1] // get id
                            this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                results.splice(0, results.length);
            }
        }
    }


    
    
    
    update(time) {
        this.animator.update(time);
    }
  

    updateTexCoords(length_s,length_t) {};

}



    




