class MyGameSequence extends CGFobject {
    /**
     * Constructor of the class MyGameSequence.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);
        this.scene;
        this.gameMoves = [];
    };

    addGameMove(gameMove){
        this.gameMoves.push(gameMove);
    }

    undo(board){
        if(this.gameMoves.length < 1){
            console.log("Cannot undo in first play!");
        }else{
            let lastGameMove = this.gameMoves[this.gameMoves.length-1];
            let row = lastGameMove.destinationTile.getRow();
            let newRow = lastGameMove.originTile.getRow();
            let col = lastGameMove.destinationTile.getCol();
            let newCol = lastGameMove.originTile.getCol();
            board.movePiece(row, col,newRow,newCol);
            lastGameMove.destinationTile.setPiece(lastGameMove.oldPiece);
            this.gameMoves.pop();
        }
    }

    movie(){

    }

}



    




