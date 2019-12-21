class MyGameBoard extends CGFobject {
    /**
     * Constructor of the class MyGameBoard.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        this.boardCells = [];
        this.currentBoard = [
                            [["blue","wn","bt"], ["blue","bn","wt"], ["blue","wn","bt"], ["blue","bn","wt"], ["blue","wn","bt"]],
                            [["empty",null,"wt"], ["empty",null,"bt"], ["empty",null,"wt"], ["empty",null,"bt"], ["empty",null,"wt"]],
                            [["empty",null,"bt"], ["empty",null,"wt"], ["empty",null,"bt"], ["empty",null,"wt"], ["empty",null,"bt"]],
                            [["empty",null,"wt"], ["empty",null,"bt"], ["empty",null,"wt"], ["empty",null,"bt"], ["empty",null,"wt"]],
                            [["red","wn","bt"], ["red","bn","wt"], ["red","wn","bt"], ["red","bn","wt"], ["red","wn","bt"]]
                            ];


        var width = 5;
        var height = 5;
        let  counter = 0;

        for (var i = 0; i < height; i++) {
            let boardCellsList = []
            
            for (var j = 0; j < width; j++) {
                let pieceList = this.getPieceList(i,j);
              
                let piece = new ChameleonPiece(scene,pieceList);
                piece.setCoordinates(j ,i);

                boardCellsList.push(new BoardCell(scene, j, i,i, j,piece));
            }
            this.boardCells.push(boardCellsList);
        }
     
        


    };

    /**
     * MyGameBoard Display function. Displays all the MyGameBoard cells and registers them for picking.
     */
    display() {
        var degToRad = Math.PI / 180;

        for (var i = 0; i < this.boardCells.length; i++) {
            for (var j = 0; j < this.boardCells[i].length; j++) {
                this.scene.registerForPick(j*5+i+1, this.boardCells[i][j]);
                this.boardCells[i][j].display();
                
                if(this.boardCells[i][j].getPiece() != null){
                    this.boardCells[i][j].getPiece().display();
                    // this.scene.registerForPick(j*5+i+1, this.boardCells[i][j].getPiece());

                    
                    
                }
            }
        }

    }

    addPieceTile(){
        
    }

    removePieceTile(row,collumn){
        this.boardCells[row][collumn].setPiece(null);
        
    }
    getPieceList(row,collumn){
        return this.currentBoard[row][collumn];
    }

    getTileByCoords(){

    }

    movePiece(row, collumn,newRow,newColumn){
        //TODO
        //Verify if valid move and that shit
        let piece = this.boardCells[row][collumn].getPiece();
        if(piece != null){
            let coords = this.boardCells[newRow][newColumn].getCoords();
            this.removePieceTile(row,collumn);
            this.boardCells[newRow][newColumn].setPiece(piece);
            piece.setCoordinates(coords[0],coords[2]);
        }
                
    }


    updateTexCoords(length_s,length_t) {};

}