/**
 * ChameleonPiece
 * @constructor
 */
class ChameleonPiece extends CGFobject {
    constructor(scene, body_texture, head_texture, material) {
        super(scene);
        this.scene;
        this.body_texture = body_texture;
        this.head_texture = head_texture;
        this.material = material;

        this.body = new MyCylinder(this.scene, 1, 1, 1, 20, 10);
        this.top = new Circle(this.scene, 20);
        this.head = new Circle(this.scene, 20);
    }
    getBody(){
        this.body.display();

        this.scene.pushMatrix();
        this.scene.translate(0,0,1);
        this.top.display();
        this.scene.popMatrix();

        this.material.setTexture(this.body_texture);
        this.material.apply();
    }
    getHead(){
        this.body.display();

        this.scene.pushMatrix();
        this.scene.scale(0.75,0.75,1);
        this.scene.translate(0,0,1);
        this.head.display();
        this.scene.popMatrix();

        this.material.setTexture(this.body_texture);
        this.material.apply();
    }
    display() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1,0,0);

        this.getBody();
        this.getHead();

        this.scene.popMatrix();
    }
}
