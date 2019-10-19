/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks)
	{
		super(scene);

		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let phi = 2*Math.PI/this.slices;
		let theta = Math.PI/this.stacks;

		for(let i = -this.stacks/2; i < this.stacks/2; i++) {
			for(let j = 0; j <= this.slices; j++) {

				this.vertices.push(
                    this.radius*Math.cos(theta*i)*Math.cos(phi*j), 
                    this.radius*Math.cos(theta*i)*Math.sin(phi*j), 
                    this.radius*Math.sin(theta*i)
				);

				let nx = Math.cos(phi*i)*Math.cos(theta*j);
				let ny = Math.cos(phi*i)*Math.sin(theta*j);
				let nz = Math.sin(phi*i);

				let size = Math.sqrt(Math.pow(nx, 2) + Math.pow(ny, 2) + Math.pow(nz, 2));

				this.normals.push(
					nx/size, 
                    ny/size,
                    nz/size
				);

				this.texCoords.push(
					1 - j/this.slices,
					1 - (1/2 + i/this.stacks)
				);

			}

		}

		this.initialTexCoords = this.texCoords;

		for (let i = 0; i < this.slices; ++i) {
			for(let j = 0; j < this.stacks; ++j) {
				this.indices.push(
                    (i+1)*(this.stacks+1) + j,  i*(this.stacks+1) + j,i*(this.stacks+1) + j+1,
                    i*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j
				);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(length_s, length_t){
		this.texCoords = this.initialTexCoords.slice();

		for(var i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] /= length_s;
			this.texCoords[i + 1] /= length_t;
		}

		this.updateTexCoordsGLBuffers();
	};
};