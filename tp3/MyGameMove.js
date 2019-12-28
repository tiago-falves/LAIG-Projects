class MyGameMove extends CGFobject {
    /**
     * Constructor of the class MyGameMove.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene,piece,originTile,destinationTile,board) {
        super(scene);
        this.scene;
        this.piece = piece;
        this.originTile = originTile;
        this.destinationTile = destinationTile;
        this.oldPiece = destinationTile.getPiece();
        this.board = board;

    };

    animate(){
        
    }



}



    




