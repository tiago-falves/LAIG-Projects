class MyGameOrchestrator extends CGFobject {
    /**
     * Constructor of the class MyGameOrchestrator.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);
        this.scene;
       
        this.gameStates = {
            START: 0,
            START_PLAY: 1,
            MOVING_PIECE: 2,
            MOVIE:3,
            GAME_OVER: 4
        };
        
        this.redVictories = 0;
        this.blueVictories = 0;

        this.game_ended = false;
        
        this.updateError(" ");
        this.updateScore();

        this.aiplayer = "blue";

        //Testing
        this.initGame();
    };

    /**
     * MyGameOrchestrator Display function. Displays all the MyGameOrchestrator cells and registers them for picking.
     */
    display() {
        this.board.display();
    }

    initGame(){
        this.currentState = this.gameStates.START_PLAY;
        this.gameSequence = new MyGameSequence(this.scene);
        this.currentPlayer = "red";
        this.initBoard();
    }

    initBoard(){
        this.board = new MyGameBoard(this.scene);
    }

    async onObjectSelected(obj, id) {
        if(obj instanceof ChameleonPiece){
            // do something with id knowing it is a piece
            console.log("Picked object: " + obj + ", with pick id " + customId);										

        }
        else{
            if(obj instanceof BoardCell){
                // do something with id knowing it is a tile
                if(this.currentState == this.gameStates.START_PLAY){ //){
                    if(obj.getPiece() != null){
                        if(obj.getPiece().getTeam()== this.currentPlayer) {

                            console.log("Picked object: " + obj + ", with pick id " + id);		
                            this.originPos = obj.getRowColumn();
                            console.log("MOVING PIECE row: " + this.originPos[0] + " col: " + this.originPos[1]);		
                            this.currentState = this.gameStates.MOVING_PIECE;
                        }
                    }
                } else if (this.currentState == this.gameStates.MOVING_PIECE){
                    console.log("Moved PIECE to row: " + obj.row + " col: " + obj.col);	

                    let gameMove = await this.board.movePiece(this.currentPlayer, this.originPos[0],this.originPos[1],obj.row,obj.col);
                    if(gameMove != null){
                        this.updateError(" ");
                        this.gameSequence.addGameMove(gameMove);

                        let winner = await this.board.gameover(this.currentPlayer);

                        if(winner == "red" || winner == "blue"){
                            console.log("its over");
                            this.end_game(winner);
                            return;
                        }
                        this.changeTeam();
                    }else this.updateError("Invalid play");

                    this.currentState = this.gameStates.START_PLAY;
                }
            }
        }   
    }

    async machineMove(){
        this.updateError(" ");

        this.changeTeam();
        
        this.currentState = this.gameStates.START_PLAY;

        let gameMove = await this.board.machineMove(this.aiplayer);

        this.gameSequence.addGameMove(gameMove);

        let winner = await this.board.gameover(this.aiplayer);

        if(winner == "red" || winner == "blue"){
            console.log("its over");
            this.end_game(winner);
            return;
        }
    }

    end_game(winner){
        this.game_ended = true;

        if(winner == "red")
                this.redVictories++;
            else this.blueVictories++;

        this.updateScore();

        this.sleep(2000);
    }

    reset(){
        this.currentPlayer = "blue";
        this.game_ended = false;
        this.changeTeam();
        this.initGame();
    }

    changeTeam(){
        if(this.currentPlayer == "blue"){
            this.currentPlayer = "red";
        } else{
            this.currentPlayer = "blue";
        }
        setTimeout(() => {  this.scene.rotateCamera(this.currentPlayer); }, 1500);
        // this.scene.rotateCamera(this.currentPlayer);
    }

    managePick(pickMode, results) {
        if(this.scene.mode=="Player VS Machine" && this.currentPlayer == "blue"){
            this.machineMove(this.currentPlayer);
        }
        if (pickMode == false /* && some other game conditions */){
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
    
    updateError(error){
        document.getElementById("error").innerText = error;
    }

    updateScore(){
        document.getElementById("score").innerText = "Red " + this.redVictories + " : " + this.blueVictories + " Blue";
    }

    sleep(ms) {
        var unixtime_ms = new Date().getTime();
        while(new Date().getTime() < unixtime_ms + ms) {}
    }
}



    




