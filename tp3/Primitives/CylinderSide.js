class CylinderSide extends CGFobject {
    constructor(scene, radius_bottom, radius_top, height, slices, stacks) {
        super(scene);
        this.radius_bottom = radius_bottom;
        this.radius_top = radius_top;
        this.slices = slices;
        this.height = height;
        this.stacks = stacks;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        //Define angles and radius
        let alphaAng = 2 * Math.PI / this.slices;
        let section = this.height/this.stacks;
        let radius_diff = (this.radius_top-this.radius_bottom)/this.stacks;

        for(let i = 0; i <= this.stacks; i++){
            let radius_current = this.radius_bottom + i*radius_diff;

            for (let j = 0; j <= this.slices; j++) {

                //Vertices
                this.vertices.push(
                    radius_current*Math.cos(j*alphaAng),
                    radius_current*Math.sin(j*alphaAng),
                    i*section
                );      

                //Normals
                let nx = Math.cos(j*alphaAng);
				let ny = Math.sin(j*alphaAng);
				let nz = this.radius_bottom - this.radius_top;

				let size = Math.sqrt(Math.pow(nx, 2) + Math.pow(ny, 2) + Math.pow(nz, 2));

				this.normals.push(
					nx/size, 
                    ny/size,
                    nz/size
				);

                //TextCoords
                this.texCoords.push(
                    j/this.slices,
                    1 - i/this.stacks
                );
            }
        }

        this.initialTexCoords = this.texCoords;

        for (let i = 0; i < this.stacks; ++i) {
			for(let j = 0; j < this.slices; ++j) {
				this.indices.push(
                    j + i*(this.slices + 1), j + i*(this.slices + 1) + 1, j + (i + 1)*(this.slices + 1),
                    j + (i + 1)*(this.slices + 1), j + i*(this.slices + 1) + 1, j + (i + 1)*(this.slices + 1) + 1
				);
			}
		}

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(length_s, length_t){
		this.texCoords = this.initialTexCoords.slice();

		for(var i = 0; i < this.texCoords.length; i += 2){
			this.texCoords[i] /= length_s;
			this.texCoords[i + 1] /= length_t;
		}

		this.updateTexCoordsGLBuffers();
    }   
};