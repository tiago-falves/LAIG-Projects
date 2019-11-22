class Cylinder2 extends CGFobject {
	/**
	 * Build a Cylinder2 object using NURBS
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} radius_bottom radius for radius_bottom
	 * @param {Number} radius_this.radius_top radius for radius_this.radius_top
	 * @param {Number} height distance between covers
	 * @param {Number} slices number of slices
	 * @param {Number} stacks number of stacks
	 */
	constructor(scene, radius_bottom, radius_top, height, slices, stacks) {
		super(scene);

		this.radius_bottom = radius_bottom;
		this.radius_top = radius_top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;


		this.initControlPoints();

		let nurbsSurfaceTop = new CGFnurbsSurface(3, 1, this.controlPointsUpper);
        this.objTop = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurfaceTop);
        
        let nurbsSurfaceLower = new CGFnurbsSurface(3, 1, this.controlPointsLower);
        this.objLower = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurfaceLower);
        
        //this.display();
    };

    updateTexCoords(length_s, length_t){
		
	};

	/**
	 * Display this object.
	 */
	display() {
		this.objTop.display();
		this.objLower.display();
	}

	/**
	 * Initialize control points.
	 */

    

	initControlPoints() {
        this.controlPointsUpper = [];
        this.controlPointsLower = [];
        
        //Calculates Height of P according to castlejau algorithm
        this.castlejauPHeight = 2 * (2/3);
        
		this.controlPointsUpper = 
		[	// U0
            [				 
                [ this.radius_bottom, 0.0, 0.0, 1.0 ],        // V0
                [ this.radius_top, 0.0, this.height, 1.0 ]       // V1
            ],
            // U1
            [
                [ this.radius_bottom, this.castlejauPHeight*this.radius_bottom, 0.0, 1.0 ],   // V0
                [ this.radius_top, this.castlejauPHeight*this.radius_top, this.height, 1.0 ]	// V1					 
            ],
            // U2
            [			
                [-this.radius_bottom, this.castlejauPHeight*this.radius_bottom, 0.0, 1.0 ],   // V0
				[-this.radius_top, this.castlejauPHeight*this.radius_top, this.height, 1.0 ]   // V1
            ],
            // U3
            [			
                [-this.radius_bottom, 0.0, 0.0, 1.0 ],        // V0
                [-this.radius_top, 0.0, this.height, 1.0 ]       // V1
            ]
		];
		
		this.controlPointsLower = 
		[	// U0
            [				 
                [-this.radius_bottom, 0.0, 0.0, 1.0 ],        // V0
                [-this.radius_top, 0.0, this.height, 1.0 ]       // V1
                
            ],
            // U1
            [
                [-this.radius_bottom, -this.castlejauPHeight*this.radius_bottom, 0.0, 1.0 ],  // V0
                [-this.radius_top, -this.castlejauPHeight*this.radius_top, this.height, 1.0 ]  // V1					 
            ],
            // U2
            [			
                [ this.radius_bottom, -this.castlejauPHeight*this.radius_bottom, 0.0, 1.0 ],  // V0
				[ this.radius_top, -this.castlejauPHeight*this.radius_top, this.height, 1.0 ]  // V1
            ],
            // U3
            [			
                [ this.radius_bottom, 0.0, 0.0, 1.0 ],        // V0
                [ this.radius_top, 0.0, this.height, 1.0 ]       // V1
            ]
		];
        
	}
}