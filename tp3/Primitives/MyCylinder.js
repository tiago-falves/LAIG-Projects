/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, radius_bottom, radius_top, height, slices, stacks) {
        super(scene);
        this.radius_bottom = radius_bottom;
        this.radius_top = radius_top;
        this.height = height;

        this.circle = new Circle(scene, slices);
        this.side = new CylinderSide(scene, radius_bottom, radius_top, height, slices, stacks);
    }

    display(){
        //Bottom cover
        this.scene.pushMatrix();
            this.scene.scale(this.radius_base, this.radius_base, 1);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.circle.display();
        this.scene.popMatrix();
        this.side.display();
        //Top cover
        this.scene.pushMatrix();
            this.scene.translate(0, 0, this.height);
            this.scene.scale(this.radius_top, this.radius_top, 1);
            this.circle.display();
        this.scene.popMatrix();
    }

    updateTexCoords(length_s, length_t){
		this.side.updateTexCoords(length_s, length_t);
    };
}
