/**
 * MySecurityCamera
 */
class MySecurityCamera extends CGFobject {
	constructor(scene, RTT) {
        super(scene);
        
        this.rectangle = new MyRectangle(this.scene, 0, 0.5,1,-0.5,-1);

        this.texture = RTT;

        this.shader = new CGFshader(this.scene.gl, "scenes/shaders/shader.vert", "scenes/shaders/shader.frag");
    }

    update(t) {
		this.shader.setUniformsValues({ timeFactor: t / 10000 % 1000 });
	}
    
    display() {       
        this.scene.pushMatrix();

        this.scene.setActiveShader(this.shader);

        this.texture.bind(0);

        this.rectangle.display();

        this.texture.unbind(0);

        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popMatrix();
    }
}

