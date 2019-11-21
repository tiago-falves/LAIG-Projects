/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);

		this.slices = slices;
		this.loops = loops;
		this.inner = inner;
		this.outer = outer;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];	

		for(let i = 0; i <= this.slices; ++i) {
			let theta = 2*Math.PI/this.slices * i;

			for(let j = 0; j <= this.loops; ++j) {
				let phi = 2*Math.PI/this.loops * j;				

				//Vertices
				this.vertices.push(
					(this.outer + this.inner*Math.cos(phi)) * Math.cos(theta), 
					(this.outer + this.inner*Math.cos(phi)) * Math.sin(theta), 
					this.inner * Math.sin(phi)
				);
				
				//Normals
				let nx = Math.cos(phi) * Math.cos(theta);
				let ny = Math.cos(phi) * Math.sin(theta);
				let nz = Math.sin(phi);

				let size = Math.sqrt(Math.pow(nx, 2) + Math.pow(ny, 2) + Math.pow(nz, 2));

				this.normals.push(
					nx/size, 
                    ny/size,
                    nz/size
				);

				//TextCoords
				this.texCoords.push(
					i/this.slices,
					j/this.loops
				);
			}

		}

		this.initialTexCoords = this.texCoords;

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j + 1, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j + 1
				);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
	
	updateTexCoords(length_s, length_t){
		this.texCoords = this.initialTexCoords;

		for(let i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] /= length_s;
			this.texCoords[i + 1] /= length_t;
		}

		this.updateTexCoordsGLBuffers();
	};
};