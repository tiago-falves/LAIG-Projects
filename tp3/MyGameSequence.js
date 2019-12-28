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
        this.totalTime = 2000*this.gameMoves.length;

    }

    undo(board){
        
        let lastGameMove = this.gameMoves[this.gameMoves.length-1];
        let row = lastGameMove.destinationTile.getRow();
        let newRow = lastGameMove.originTile.getRow();
        let col = lastGameMove.destinationTile.getCol();
        let newCol = lastGameMove.originTile.getCol();
        board.movePiece(row, col,newRow,newCol);
        lastGameMove.destinationTile.setPiece(lastGameMove.oldPiece);
        this.gameMoves.pop();
        
    }

    movie(initialBoard){

        for (let index = 0; index < this.gameMoves.length; index++) {

            setTimeout(function(){
                let row = this.gameMoves[index].originTile.getRow();
                let newRow = this.gameMoves[index].destinationTile.getRow();
                let col = this.gameMoves[index].originTile.getCol();
                let newCol = this.gameMoves[index].destinationTile.getCol();
                initialBoard.movePiece(row,col,newRow,newCol);
                console.log(row,col,newRow,newCol);

            
            }.bind(this), 2000*index);
        }

        
        // for (let index = 0; index < this.gameMoves.length; index++) {
            
        //     console.log(row,col,newRow,newCol);
        //     setTimeout(() => {
        //         initialBoard.movePiece(row,col,newRow,newCol);
        //     }, 500);


            
        // }
        
      

    }

}



    




