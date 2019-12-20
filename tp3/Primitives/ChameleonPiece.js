/**
 * ChameleonPiece
 * @constructor
 */
class ChameleonPiece extends CGFobject {


    constructor(scene, team, nature) {
        super(scene);
        this.scene;
        this.team = team;
        this.nature = nature;

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
        if(this.nature == "white")
            this.whiteMaterial.apply();
        else if(this.nature == "black"){
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
    
    display() {
        this.scene.pushMatrix();
            this.scene.scale(0.3,0.3,0.3);
            this.scene.rotate(-Math.PI/2, 1,0,0);

            this.displayBody();
            this.displayHead();

        this.scene.popMatrix();
    }
    updateTexCoords(length_s, length_t) {};
}
