/**
 * MyBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyBoard extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2) {
        super(scene);
        this.position = [6.0, 2, -15];
        this.id = id;

        //Initialize scene objects

        this.board = new MyRectangle(scene, id, x1, x2, y1, y2);
        this.boardSide = new MyRectangle(scene, id, x1, x2, y1, y1+0.2);

        this.initMaterials();
    }
    
    initMaterials() {

        this.boardMaterial = new CGFappearance(this.scene);
        this.boardMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.boardMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.boardMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.boardMaterial.setShininess(10.0);
        this.boardMaterial.loadTexture('../scenes/images/board.JPG');
        this.boardMaterial.setTextureWrap('REPEAT', 'REPEAT');
    

    }
    
    display(){

        // Board Transformation
        this.scene.pushMatrix();    
        this.scene.translate(-1,0,-1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
  
        this.board.display();      
        this.boardMaterial.apply();
        this.scene.popMatrix(); 

        // Board Transformation
        this.scene.pushMatrix();    
        this.scene.translate(-1,0.2,-1);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.board.display();      
        this.boardMaterial.apply();
        this.scene.popMatrix(); 

        //Sides

        this.scene.pushMatrix();    
        this.scene.translate(-1,0,1);
        this.boardSide.display();   
        this.boardMaterial.apply();
        this.scene.popMatrix();    

        this.scene.pushMatrix();    
        this.scene.translate(1,0,1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.boardSide.display();   
        this.boardMaterial.apply();
        this.scene.popMatrix();    

        this.scene.pushMatrix();    
        this.scene.translate(-1,0,-1);
        this.boardSide.display();   
        this.boardMaterial.apply();
        this.scene.popMatrix();  

        this.scene.pushMatrix();    
        this.scene.translate(-1,0,1);
        this.scene.rotate(Math.PI/2, 0, 1, 0);

        this.boardSide.display();   
        this.boardMaterial.apply();
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

