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

		

		for(var i = 0; i <= this.slices; ++i) {
			var alfa = 2*Math.PI/this.slices * i;
			for(var j = 0; j <= this.loops; ++j) {
				
				var beta = 2*Math.PI/this.loops * j;

				this.vertices.push(
					(this.outer + this.inner*Math.cos(beta)) * Math.cos(alfa), 
					(this.outer + this.inner*Math.cos(beta)) * Math.sin(alfa), 
					this.inner * Math.sin(beta)
				);

				this.normals.push(
					Math.cos(alfa) * Math.cos(beta), 
                    Math.sin(alfa) * Math.cos(beta),
                    Math.sin(beta)
				);

			}

		}

		for (var i = 0; i < this.slices; ++i) {
			for(var j = 0; j < this.loops; ++j) {
				this.indices.push(
					(i+1)*(this.loops+1) + j, i*(this.loops+1) + j + 1, i*(this.loops+1) + j,
					i*(this.loops+1) + j+1, (i+1)*(this.loops+1) + j, (i+1)*(this.loops+1) + j + 1
				);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
	
	updateTextCoords(length_s, length_t){
		this.texCoords = [
			(this.c - this.a*this.cos_beta)/length_s, (length_t - this.a*this.sin_beta)/length_t,
			0, 1,
			this.c/length_s, 1
		];

		this.updateTexCoordsGLBuffers();
	}
};