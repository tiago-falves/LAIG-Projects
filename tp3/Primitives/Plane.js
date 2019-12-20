class Plane extends CGFobject {
	constructor(scene,id,npartsU,npartsV) {
		super(scene);
        this.scene = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.initBuffers();
	}
	
	initBuffers() {
		let controlPoints = [
				// U = 0
                [ // V = 0..1;
                     [-0.5, 0.0, 0.5, 1 ],
                     [-0.5, 0.0, -0.5, 1 ]
                    
                ],
                // U = 1
                [ // V = 0..1
                     [ 0.5, 0.0, 0.5, 1 ],
                     [ 0.5, 0.0, -0.5, 1 ]							 
                ]
            
        ];
        let nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
    };

    display() {
        this.obj.display();
    }

    updateTexCoords(length_s, length_t){
		
	};
};