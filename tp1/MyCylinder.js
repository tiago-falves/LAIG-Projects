/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, radius_bottom, radius_top, height, slices, stacks) {
        super(scene);
        this.radius_bottom = radius_bottom;
        this.radius_top = radius_top;
        this.slices = slices;
        this.height = height;
        this.stacks = stacks
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let alphaAng = 2 * Math.PI / this.slices;
        let section = this.height/this.stacks;
        let radius_diff = (this.radius_top-this.radius_bottom)/this.stacks;

        for(let i = 0; i <= this.stacks; i++){
            let radius_current = this.radius_bottom + i*radius_diff;

            for (let j = 0; j <= this.slices; j++) {
                this.vertices.push(
                    radius_current*Math.cos(j*alphaAng),
                    radius_current*Math.sin(j*alphaAng),
                    i*section
                );             

                this.normals.push(
                    Math.cos(j*alphaAng),
                    Math.sin(j*alphaAng),
                    0
                );

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

/*
        //Base drawing
        ang = 0;
        for(i = 0; i < this.slices; i++){
            let sal=radius*Math.sin(ang);
            let cal=radius*Math.cos(ang);
            this.vertices.push(cal, 0, -sal);
            this.vertices.push(cal, this.height, -sal);
            this.normals.push(0,-1,0);
            this.normals.push(0,1,0);
            this.indices.push((2*i+2) % (2*this.slices) + 4*this.slices, 4*this.slices+(2*i), 6*this.slices);
            this.indices.push(6*this.slices+1, 4*this.slices+(2*i+1), (2*i+3) % (2*this.slices) + 4*this.slices);
            this.texCoords.push(
                0,0,
                0,0
            );
            ang+=alphaAng;
        }
        
        this.vertices.push(0,0,0);
        this.vertices.push(0,this.height,0);
        this.normals.push(0,-1,0);
        this.normals.push(0,1,0);
        this.texCoords.push(
            0,0,
            0,0
        );
*/
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
}