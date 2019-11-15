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
			this.x3, this.y3, this.z3,	//2
			this.x1, this.y1, this.z1,	//3
			this.x2, this.y2, this.z2,	//4
			this.x3, this.y3, this.z3	//5
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			5, 4, 3 //clock wise so it can be seen both ways
		];
		
		let A = [this.x2-this.x1, this.y2-this.y1, this.z2-this.z1];
		let B = [this.x3-this.x1, this.y3-this.y1, this.z3-this.z1];

		let size = Math.sqrt(Math.pow(A[0] - B[0], 2) + Math.pow(A[1] - B[1], 2) + Math.pow(A[2] - B[2], 2));

		//Normals
		let nx = (A[1]*B[2] - A[2]*B[1])/size;
		let ny = (A[2]*B[0] - A[0]*B[2])/size;
		let nz = (A[0]*B[1] - A[1]*B[0])/size;

		this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz,
			-nx, -ny, -nz,
			-nx, -ny, -nz,
			-nx, -ny, -nz,
		];

		this.a = Math.sqrt(Math.pow((this.x1-this.x3),2) + Math.pow((this.y1-this.y3),2) + Math.pow((this.z1-this.z3),2));
		this.b = Math.sqrt(Math.pow((this.x2-this.x1),2) + Math.pow((this.y2-this.y1),2) + Math.pow((this.z2-this.z1),2));
		this.c = Math.sqrt(Math.pow((this.x3-this.x2),2) + Math.pow((this.y3-this.y2),2) + Math.pow((this.z3-this.z2),2));

		this.cos_beta = (Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c);
		this.sin_beta = Math.sqrt(1 - Math.pow(this.cos_beta, 2));
	
		this.updateTexCoords(1,1);

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(length_s, length_t){
		this.texCoords = [
			0, 0,
			this.a/length_s, 0,
			this.c * this.cos_beta / length_s, this.c * this.sin_beta / length_t,
			0, 0,
			this.a/length_s, 0,
			this.c * this.cos_beta / length_s, this.c * this.sin_beta / length_t
		];
		// To do coordenada como se fosse um triangulo equilatero

		this.updateTexCoordsGLBuffers();
	}
}
