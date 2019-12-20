class MyGameBoard extends CGFobject {
    /**
     * Constructor of the class MyGameBoard.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene) {
        super(scene);

        this.boardCells = [];
        var width = 5;
        var height = 5;
        let  counter = 0;

        for (var i = 0; i < height; i++) {
            let boardCellsList = []
            let color = "white";
            
            for (var j = 0; j < width; j++) {
                if(counter % 2 == 0){
                    color = "black";
                }
                else color = "white";
                counter++;
                boardCellsList.push(new BoardCell(scene, j, i,i, j,color));
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
            }
        }

    }

    addPieceTile(){

    }

    removePieceTile(){
        
    }
    getPieceTile(){

    }

    getTileByCoords(){

    }

    movePiece(){
        
    }


    updateTexCoords(length_s,length_t) {};

}