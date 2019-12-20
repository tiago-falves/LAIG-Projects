class Board extends CGFobject {
    /**
     * Constructor of the class Board.
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
     * Board Display function. Displays all the board cells and registers them for picking.
     */
    display() {
        var degToRad = Math.PI / 180;

        for (var i = 0; i < this.boardCells.length; i++) {
            for (var j = 0; j < this.boardCells[i].length; j++) {
                this.boardCells[i][j].display();
            }
        }

    }


    updateTexCoords(length_s,length_t) {};

}