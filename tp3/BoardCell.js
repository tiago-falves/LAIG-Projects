/**
 * BoardCell
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

/**
 * BoardCell class, a 3D representation of our game board cell.
 * @extends CGFobject
 */
class BoardCell extends CGFobject {

    constructor(scene, xPos, zPos, row, col,piece) {
        super(scene);

        this.xPos = xPos;
        this.yPos = 0;
        this.zPos = zPos;
        this.row = row;
        this.col = col;
        this.piece = piece;
        this.color = piece.getTileColor();
        this.side = 1;
        this.pickingEnabled = true;
   
        this.quad = new MyRectangle(scene, 1, 0, this.side, 0, this.side);

        this.blackappearance = new CGFappearance(this.scene);
        this.blackappearance.setAmbient(0.1,0.1,0.1,1);
        this.blackappearance.setDiffuse(0.1,0.1,0.1,1);
        this.blackappearance.setSpecular(0.7,0.7,0.7,1);
        this.blackappearance.setShininess(150);
        //this.blackappearance.loadTexture('prob1/scenes/images/board.JPG');

        this.whiteAppearance = new CGFappearance(this.scene);
        this.whiteAppearance.setAmbient(0.8, 0.8, 0.8, 1);
        this.whiteAppearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.whiteAppearance.setSpecular(1, 1, 1, 1);
        this.whiteAppearance.setShininess(10.0);

        this.highlightedAppearance = new CGFappearance(this.scene);
        this.highlightedAppearance.setAmbient(0.07,0.1,0.07,1);
        this.highlightedAppearance.setDiffuse(0.4,0.6,0.4,1);
        this.highlightedAppearance.setSpecular(0.2,0.3,0.2,1);
        this.highlightedAppearance.setShininess(150);
        //this.highlightedAppearance.loadTexture("../scenes/images/boardCell.jpg");
    };

 
    display() {

        var degToRad = Math.PI / 180;

        this.scene.pushMatrix();

            this.scene.translate(this.xPos, this.yPos, this.zPos);
            this.scene.scale(1, 0.3, 1);

            if(this.color == "bt"){
                this.blackappearance.apply();
            }else if (this.color == "wt"){
                this.whiteAppearance.apply();
            }


            this.scene.pushMatrix();
                this.scene.translate(0, 0, this.side);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, this.side, 0);
                this.scene.rotate(180*degToRad, 1, 0, 0);
                this.quad.display();
            this.scene.popMatrix();
            

            this.scene.pushMatrix();
                this.scene.translate(this.side, 0, this.side);
                this.scene.rotate(90*degToRad, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();

            
            this.scene.pushMatrix();
     
                this.scene.rotate(-90*degToRad, 0, 1, 0);
                this.quad.display();
            this.scene.popMatrix();
            

            this.scene.pushMatrix();
    
                this.scene.rotate(90*degToRad, 1, 0, 0);
                this.quad.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, this.side, this.side);
                this.scene.rotate(-90*degToRad, 1, 0, 0);

                // if (this.highlighted)
                //     this.highlightedAppearance.apply();
                // else
                //     this.blackappearance.apply();

                this.quad.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }

 
    getCoords() {
        return [this.xPos, this.yPos, this.zPos];
    }
    setCoords(x,y,z) {
       this.xPos = x;
       this.yPos = y;
       this.zPos = z;
    }

    getRowColumn() {
        return [this.row,this.col];
    }
    getRow(){
        return this.row;
    }
    getCol(){
        return this.col;
    }
    getPiece(){
        return this.piece;
    }

    setPiece(newPiece){
        this.piece = newPiece;
    }
    unSetPiece(){
        this.piece = null;
    }

 
    updateTexCoords(length_s, length_t) {};

}
