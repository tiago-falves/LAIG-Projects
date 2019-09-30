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

		var alfa = 2*Math.PI/this.slices;
		var beta = 2*Math.PI/this.loops;

		for(var i = 0; i <= this.slices; ++i) {

			for(var j = 0; j <= this.loops; ++j) {

				this.vertices.push(
					(this.outer + this.inner*Math.cos(beta*j)) * Math.cos(alfa*i), 
					(this.outer + this.inner*Math.cos(beta*j)) * Math.sin(alfa*i), 
					this.inner * Math.sin(beta*j)
				);

				

				this.normals.push(
					Math.cos(alfa*i) * Math.cos(beta*j), 
                    Math.sin(alfa*i) * Math.cos(beta*j),
                    0
				);

			}

		}

		for (var i = 0; i < this.slices; ++i) {
			for(var j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j
				);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    };
};