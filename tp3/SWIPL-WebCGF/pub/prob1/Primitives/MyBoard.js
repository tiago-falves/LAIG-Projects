/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBoard extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
        super(scene);
        this.id = id;
        this.x1 =x1;
        this.x2 =x2;
        this.y1 =y1;
        this.y2 =y2;

        //Initialize scene objects

        this.board = new MyRectangle(scene, id, x1, x2, y1, y2);
        this.boardSide = new MyRectangle(scene, id, x1, x2, y1, y1+0.2);

        this.initMaterials();
    }
    
    initMaterials() {
        // <emission r="0.0" g="0.0" b="0.0" a="1.0" />
        //     <ambient r="1.0" g="1.0" b="1.0" a="1.0" />
        //     <diffuse r="0.6" g="0.6" b="0.6" a="1.0" />
        //     <specular r="1" g="1" b="1" a="1.0" />

        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.whiteMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.whiteMaterial.setSpecular(1, 1, 1, 1);
        this.whiteMaterial.setShininess(10.0);


        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.boardMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setSpecular(1, 1, 1, 1);
        this.boardMaterial.setShininess(10.0);
        this.boardMaterial.loadTexture('../prob1/scenes/images/board.JPG');
        this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    display(){

        // Board Transformation
        this.scene.pushMatrix();    
        //this.scene.translate(-(this.x2-this.x1)/2,0,-(this.x2-this.x1)/2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.board.display();      
        this.boardMaterial.apply();
        this.scene.popMatrix(); 

        // Board Transformation
        this.scene.pushMatrix();    
        this.scene.translate(0,0.2,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.board.display();      
        this.boardMaterial.apply();
        this.scene.popMatrix(); 

        //Sides

        this.scene.pushMatrix();    
        //this.scene.translate(-(this.x2-this.x1)/2,0,(this.x2-this.x1)/2);
        this.boardSide.display();   
        this.whiteMaterial.apply();
        this.scene.popMatrix();    

        this.scene.pushMatrix();    
        this.scene.translate(0,0,(this.x2-this.x1));
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.boardSide.display();   
        this.whiteMaterial.apply();
        this.scene.popMatrix();    

        this.scene.pushMatrix();    
        this.scene.translate(0,0,(this.x2-this.x1));
        this.boardSide.display();   
        this.whiteMaterial.apply();
        this.scene.popMatrix();  

        this.scene.pushMatrix();    
        this.scene.translate((this.x2-this.x1),0,(this.x2-this.x1));
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.boardSide.display();   
        this.whiteMaterial.apply();
        this.scene.popMatrix();     
        
    }

    updateTexCoords(length_s, length_t){
		let diff_x = this.x2 - this.x1;
		let diff_y = this.y2 - this.y1;

		this.texCoords = [
			0, diff_y / length_t,
			diff_x/length_s, diff_y / length_t,
			0, 0,
			diff_x/length_s, 0
		];

		this.updateTexCoordsGLBuffers();
	};
}

