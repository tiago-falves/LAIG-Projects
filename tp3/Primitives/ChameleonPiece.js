/**
 * ChameleonPiece
 * @constructor
 */
class ChameleonPiece extends CGFobject {


    constructor(scene, pieceList) {
        super(scene);
        this.scene;
        this.team = pieceList[0];
        this.nature = pieceList[1];
        this.tileColor = pieceList[2];
            

        this.xCoord = 0;
        this.yCoord = 0.3;
        this.zCoord = 0;

        this.row = -1;
        this.col = -1;

        this.body = new MyCylinder(this.scene, 1, 1, 1, 20, 10);
        this.head = new Circle(this.scene, 20);

        this.initMaterials();
    }




    initMaterials(){
        this.redMaterial = new CGFappearance(this.scene);
        this.redMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.redMaterial.setDiffuse(0.9, 0.1, 0.1, 1);
        this.redMaterial.setSpecular(1, 0.1, 0.1, 1);
        this.redMaterial.setShininess(10.0);

        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0.1, 0.1, 0.9, 1);
        this.blueMaterial.setDiffuse(0.1, 0.1, 0.9, 1);
        this.blueMaterial.setSpecular(0.1, 0.1, 0.9, 1);
        this.blueMaterial.setShininess(10.0);

        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.whiteMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.whiteMaterial.setSpecular(1, 1, 1, 1);
        this.whiteMaterial.setShininess(10.0);
        // Dar upload de uma textura que seja um circulo branco dentro de um preto...

        this.blackMaterial = new CGFappearance(this.scene);
        this.blackMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.blackMaterial.setDiffuse(0.1, 0.1, 0.1, 1);
        this.blackMaterial.setSpecular(0.5, 0.5, 0.5, 0.5);
        this.blackMaterial.setShininess(10.0);
    }


    getTeam(){
        return this.team;
    }
    getNature(){
        return this.nature;
    }

    setTileColor(tileColor){
        this.tileColor = tileColor;
    }
    getTileColor(){
        return this.tileColor;
    }
    setTileColor(tileColor){
        this.tileColor = tileColor;
    }

    setBoardCoordinates(row, col) {
        this.row = row;
        this.col = col;
    }
    setCoordinates(xCoord,zCoord) {
        this.xCoord = xCoord + 0.5;
        this.zCoord = zCoord +0.5;
    }



    displayBody(){
        this.scene.pushMatrix();
        if(this.team == "red")
            this.redMaterial.apply();
        else if(this.team == "blue")
            this.blueMaterial.apply();
        this.body.display();
        this.scene.popMatrix();

    
    }
    displayHead(){
    

        this.scene.pushMatrix();
        if(this.nature == "wn")
            this.whiteMaterial.apply();
        else if(this.nature == "bn"){
            this.blackMaterial.apply();
        }

        this.scene.translate(0,0,1);
        this.head.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,1,0,0);
        this.head.display();
        this.scene.popMatrix();

    }

    displayPiece(){
        if(this.team != "empty"){
            this.displayBody();
            this.displayHead();
        }
    }
    
    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.xCoord,this.yCoord,this.zCoord);
            this.scene.scale(0.3,0.3,0.3);
            this.scene.rotate(-Math.PI/2, 1,0,0);

            this.displayPiece();

            

        this.scene.popMatrix();
    }
    updateTexCoords(length_s, length_t) {};
}
