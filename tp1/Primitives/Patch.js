class Patch extends CGFobject{
    constructor(scene,id,npartsU,npartsV,npointsU,npointsV,controlPoints){
        super(scene);
        this.id = id;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;
        this.initBuffers();
       // this.display();
    }

    initBuffers(){

        /*let control_vertexes = [];

        for (let i = 0; i < this.npointsU; i++) {

            let uControlPoint = [];

            for (let j = 0; j < this.npointsV; j++) {
                let controlPoint = this.controlPoints[i*this.npointsV + j];
                //controlPoint.push(1);
                uControlPoint.push(controlPoint);
            }
            control_vertexes.push(uControlPoint);

        }*/

        let nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlPoints);
        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
    
    updateTexCoords(length_s, length_t){
		
	};

    display() {
		this.obj.display();
	}
};