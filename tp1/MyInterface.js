/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
        this.cameraController;

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    

    createMenus(){
        this.gui.add(this.scene, 'currentCamera', this.scene.cameraIDs).name('Selected View').onChange(this.scene.updateCamera.bind(this.scene));
        
        this.lightsMenu = this.gui.addFolder('Lights');
        var i = 0
        for (var key in this.scene.lightIDs) {
            this.lightsMenu.add(this.scene.lights[i], 'enabled').name(key);
            i++
        }
        
      }
}