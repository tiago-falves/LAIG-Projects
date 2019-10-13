var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.currentCamera;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.appearance = new CGFappearance(this);
        
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        
        
        
        //In case there is an error with the XML File
        let currentCamera = this.graph.views[0];
        //Choose the camera with the appropriate default ID in case it exists.

        for(let key = 0; key < this.graph.views.length; key++) {
            let xmlView = this.graph.views[key];
            if(xmlView.id = this.graph.defaultView) {
                currentCamera = xmlView;
                break;
            }
        }
        
        if(currentCamera.type == "perspective"){
            this.camera = new CGFcamera(currentCamera.angle, currentCamera.near, currentCamera.far, currentCamera.from, currentCamera.to);  
        }
  

        this.interface.setActiveCamera(this.camera);
        
    }


    updateCamera(newCamera){
        this.currentCamera = newCamera;
    
        if(this.graph.views[newCamera].type == "perspective")
          this.camera = new CGFcamera(this.graph.views[newCamera].angle, this.graph.views[newCamera].near, this.graph.views[newCamera].far, vec3.fromValues(this.graph.views[newCamera].from.x, this.graph.views[newCamera].from.y, this.graph.views[newCamera].from.z), vec3.fromValues(this.graph.views[newCamera].to.x, this.graph.views[newCamera].to.y, this.graph.views[newCamera].to.z));
        else if(this.graph.views[newCamera].type == "ortho")
          this.camera = new CGFcameraOrtho(this.graph.views[newCamera].left, this.graph.views[newCamera].right, this.graph.views[newCamera].bottom, this.graph.views[newCamera].top, this.graph.views[newCamera].near, this.graph.views[newCamera].far, vec3.fromValues(this.graph.views[newCamera].from.x, this.graph.views[newCamera].from.y, this.graph.views[newCamera].from.z), vec3.fromValues(this.graph.views[newCamera].to.x, this.graph.views[newCamera].to.y, this.graph.views[newCamera].to.z), vec3.fromValues(0,1,0));
    
        this.interface.setActiveCamera(this.camera);
      }
   
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        //this.updateCamera(this.graph.default);

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initCameras();
        this.initLights();

        //Descomentar para descobrir erro das cameras
        //this.interface.addViews(this.graph.views);

        this.sceneInited = true;
    }

    //regist number of clicks on M key

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}