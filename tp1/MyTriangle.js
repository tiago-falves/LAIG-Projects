/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
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
		
		let A = [this.x2-this.x3, this.y2-this.y3, this.z2-this.z3];
		let B = [this.x3-this.x2, this.y3-this.y2, this.z3-this.z2];

		let normal = [
			A[1]*B[2] - A[2]*B[1],
			A[2]*B[0] - A[0]*B[2],
			A[0]*B[1] - A[1]*B[0]		
		];

		let length = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2) + Math.pow(normal[2], 2))
		let normalx = normal[0]/length;
		let normaly = normal[1]/length;
		let normalz = normal[2]/length;

		this.normals = [
			normalx, normaly, normalz,
			normalx, normaly, normalz,
			normalx, normaly, normalz
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
