/**
 * MyScurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyScurityCamera extends CGFobject {

	constructor(scene, id, x1, x2, y1, y2) {
        super(scene);
        
        //Initialize variables
        this.id = id;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        //Initialize MyUnitCubeQuad objects
        this.rectangle = new MyRectangle(this.scene, id,x1,x2,y1,y2);

        this.initMaterials();

    }

    initMaterials() {

    }
    
    display() {       

    }
}

