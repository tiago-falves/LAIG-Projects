/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);

		this.x1=x1;
		this.y1=y1;
		this.z1=z1;

		this.x2=x2;
		this.y2=y2;
		this.z2=z2;

		this.x3=x3;
		this.y3=y3;
		this.z3=z3;

		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0 //clock wise so it can be seen both ways
		];
		
		let A = [this.x2-this.x1, this.y2-this.y1, this.z2-this.z1];
		let B = [this.x3-this.x1, this.y3-this.y1, this.z3-this.z1];

		let nx = A[1]*B[2] - A[2]*B[1];
		let ny = A[2]*B[0] - A[0]*B[2];
		let nz = A[0]*B[1] - A[1]*B[0];

		this.normals = [
			nx, ny, nz,
			-nx, -ny, -nz,
			nx, ny, nz,
			-nx, -ny, -nz,
			nx, ny, nz,
			-nx, -ny, -nz
		];

		let a = Math.sqrt(Math.pow((this.x1-this.x3),2) + Math.pow((this.y1-this.y3),2) + Math.pow((this.z1-this.z3),2));
		let b = Math.sqrt(Math.pow((this.x2-this.x1),2) + Math.pow((this.y2-this.y1),2) + Math.pow((this.z2-this.z1),2));
		let c = Math.sqrt(Math.pow((this.x3-this.x2),2) + Math.pow((this.y3-this.y2),2) + Math.pow((this.z3-this.z2),2));

		let cos_beta = (Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2))/(2*a*c);
		let sin_beta = Math.sqrt(1 - Math.pow(cos_beta, 2));

/*
		this.texCoords = [
			(this.c - this.a*this.cos_beta)/length_s, (length_t - this.a*this.sin_beta)/length_t,
			0, 1,
			this.c/length_s, 1
		];
		*/
		this.updateTexCoordsGLBuffers();
	
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
