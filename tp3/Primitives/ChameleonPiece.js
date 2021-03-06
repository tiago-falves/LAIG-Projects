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
        this.animation = null;
            

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
        this.redMaterial.setAmbient(0.9, 0.1, 0.1, 1);
        this.redMaterial.setDiffuse(0.9, 0.1, 0.1, 1);
        this.redMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.redMaterial.setShininess(10.0);

        this.blueMaterial = new CGFappearance(this.scene);
        this.blueMaterial.setAmbient(0.1, 0.1, 0.9, 1);
        this.blueMaterial.setDiffuse(0.1, 0.1, 0.9, 1);
        this.blueMaterial.setSpecular(0.1, 0.1, 0.9, 1);
        this.blueMaterial.setShininess(10.0);

        // <emission r="0.8" g="0.8" b="0.8" a="1.0" />
        //     <ambient r="0.8" g="0.8" b="0.8" a="1.0" />
        //     <diffuse r="0.1" g="0.1" b="0.1" a="1.0" />
        //     <specular r="0.1" g="0.1" b="0.1" a="1.0" />


        this.redWhite = new CGFappearance(this.scene);
        this.redWhite.setAmbient(0.8,0.8,0.8,1);
        this.redWhite.setDiffuse(0.8, 0.8, 0.8, 1);
        this.redWhite.setSpecular(0.1, 0.1, 0.1, 1);
        this.redWhite.setShininess(10.0);
        this.redWhite.loadTexture("scenes/images/redWhite.png");

        this.redBlack = new CGFappearance(this.scene);
        this.redBlack.setAmbient(0.8,0.8,0.8,1);
        this.redBlack.setDiffuse(0.8, 0.8, 0.8, 1);
        this.redBlack.setSpecular(0.1, 0.1, 0.1, 1);
        this.redBlack.setShininess(10.0);
        this.redBlack.loadTexture("scenes/images/redBlack.png");

        this.blueWhite = new CGFappearance(this.scene);
        this.blueWhite.setAmbient(0.8,0.8,0.8,1);
        this.blueWhite.setDiffuse(0.8, 0.8, 0.8, 1);
        this.blueWhite.setSpecular(0.1, 0.1, 0.1, 1);
        this.blueWhite.setShininess(10.0);
        this.blueWhite.loadTexture("scenes/images/blueWhite.png");

        this.blueBlack = new CGFappearance(this.scene);
        this.blueBlack.setAmbient(0.8,0.8,0.8,1);
        this.blueBlack.setDiffuse(0.8, 0.8, 0.8, 1);
        this.blueBlack.setSpecular(0.1, 0.1, 0.1, 1);
        this.blueBlack.setShininess(10.0);
        this.blueBlack.loadTexture("scenes/images/blueBlack.png");

        this.whiteMaterial = new CGFappearance(this.scene);
        this.blueBlack.setAmbient(0.8,0.8,0.8,1);
        this.blueBlack.setDiffuse(0.8, 0.8, 0.8, 1);
        this.blueBlack.setSpecular(0.1, 0.1, 0.1, 1);
        this.blueBlack.setShininess(10.0);
        // this.whiteMaterial.loadTexture("scenes/images/blueBlack.png");

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
            if(this.nature == "wn" && this.team == "red")
                this.redWhite.apply();
            else if(this.nature == "bn" && this.team == "red"){
                this.redBlack.apply();
            }
            if(this.nature == "wn" && this.team == "blue")
                this.blueWhite.apply();
            else if(this.nature == "bn" && this.team == "blue"){
                this.blueBlack.apply();
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
            this.scene.pushMatrix();
                this.scene.scale(1,1,0.6);
                this.displayBody();
                this.displayHead();
            this.scene.popMatrix();

        }
    }

    animate(){
        this.animation.apply();
    }
    
    display() {
        this.scene.pushMatrix();
            if(this.animation != null){
                this.animate();
            }
            this.scene.translate(this.xCoord,this.yCoord,this.zCoord);
            this.scene.scale(0.3,0.3,0.3);
            this.scene.rotate(-Math.PI/2, 1,0,0);

            this.displayPiece();

            

        this.scene.popMatrix();
    }
    updateTexCoords(length_s, length_t) {};
}
