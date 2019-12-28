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
        let lastGameMove = this.gameMoves[this.gameMoves.length-1];
        let row = lastGameMove.destinationTile.getRow();
        let newRow = lastGameMove.originTile.getRow();
        let col = lastGameMove.destinationTile.getCol();
        let newCol = lastGameMove.originTile.getCol();
        board.movePiece(row, col,newRow,newCol);
        this.gameMoves.pop();
    }

    movie(){

    }

}



    




