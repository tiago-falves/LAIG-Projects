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

		var xz_angle = 2*Math.PI/this.slices;
		var y_angle = 2*Math.PI/(this.stacks);

		for(var xz = 0; xz <= this.slices; ++xz) {

			for(var y = 0; y <= this.stacks; ++y) {

				this.vertices.push(
                    this.radius*Math.cos(y_angle*y)*Math.cos(xz_angle*xz), 
                    this.radius*Math.cos(y_angle*y)*Math.sin(xz_angle*xz), 
                    this.radius*Math.sin(y_angle*y)
				);

				this.normals.push(
                    Math.cos(y_angle*y)*Math.cos(xz_angle*xz), 
                    Math.cos(y_angle*y)*Math.sin(xz_angle*xz), 
                    Math.sin(y_angle*y)
				);

				this.texCoords.push(
					1 - xz/this.slices,
					1 - (1/2 + y/this.stacks)
                  //  ((Math.cos(y_angle*y)*Math.cos(xz_angle*xz))+1)/2, 
                    //1 - ((Math.cos(y_angle*y)*Math.sin(xz_angle*xz))+1)/2
				);

			}

		}

		this.initialTexCoords = this.texCoords;

		for (var i = 0; i < this.slices; ++i) {
			for(var j = 0; j < this.stacks; ++j) {
				this.indices.push(
                    (i+1)*(this.stacks+1) + j,  i*(this.stacks+1) + j,i*(this.stacks+1) + j+1,
                    i*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j+1, (i+1)*(this.stacks+1) + j
				);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTextCoords(length_s, length_t){
		this.texCoords = this.initialTexCoords;

		for(var i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] /= length_s;
			this.texCoords[i + 1] /= length_t;
		}

		this.updateTexCoordsGLBuffers();
	};
};