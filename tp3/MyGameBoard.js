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
                let pieceList = this.getPieceTile(i,j);
              
                let piece = new ChameleonPiece(scene,pieceList);
                piece.setCoordinates(j + 0.5,0.3,i + 0.5);

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
                    
                }
            }
        }

    }

    addPieceTile(){
        
    }

    removePieceTile(){
        
    }
    getPieceTile(row,collumn){
        return this.currentBoard[row][collumn];
    }

    getTileByCoords(){

    }

    movePiece(){
        
    }


    updateTexCoords(length_s,length_t) {};

}