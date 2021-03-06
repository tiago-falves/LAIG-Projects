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


		//Define angles
		let phi = 2*Math.PI/this.slices;
		let theta = Math.PI/this.stacks;

		for(let i = 0; i < this.stacks; i++) {
			for(let j = 0; j <= this.slices; j++) {

				//Vertices and Normals
				let x = this.radius*Math.sin(theta*i)*Math.cos(phi*j); 
				let y = this.radius*Math.sin(theta*i)*Math.sin(phi*j);
				let z = this.radius*Math.cos(theta*i);

				let size = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
				
				this.vertices.push(x,y,z);
				this.normals.push(x/size,y/size,z/size);

				this.texCoords.push(j/this.slices,i/this.stacks); //Esfera invertida
			}
		}

		this.initialTexCoords = this.texCoords;

		//indices
		for (let i = 0; i < this.stacks; i++) {
			for (let j = 0; j < this.slices; j++) {
				this.indices.push(i * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j + 1);
				this.indices.push(i * (this.slices + 1) + j, (i + 1) * (this.slices + 1) + j + 1, i * (this.slices + 1) + j + 1);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	//Text Coords
	updateTexCoords(length_s, length_t){
		this.texCoords = this.initialTexCoords;

		for(var i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] /= length_s;
			this.texCoords[i + 1] /= length_t;
		}

		this.updateTexCoordsGLBuffers();
	};
};