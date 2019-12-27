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

    createMenus(){
        this.createAxisCheckbox();
        
        this.createLightFolder();

        this.createViewsFolder();
        this.createScenesFolder();

        this.initKeys();
    }

    //Adds lights Menu
    createLightFolder(){
        var folder = this.gui.addFolder("Lights");

        for(let key in this.scene.graph.lights){
            folder.add(this.scene.graph.lights[key], "0").name(key);
        }
    }

    createScenesFolder(){
        var folder = this.gui.addFolder("Scene");
        let scene = this.scene;
        folder.add(this.scene, "currentScene" , ["new.xml", "new2.xml"]).name("Scene").onChange(function(value) {
            scene.graph.changeScene(value);
        });

        // let scenes = ['new.xml','new2.xml'];
        // for(let key in scenes){
        //     folder.add(key,"0").name(key);
        // }
        // scenes.onChange(function(value) {
        //     this.scene.switchScene(value);
        // });   
    }

    //Add Camera checkboxes
    createViewsFolder(){
        var folder = this.gui.addFolder("Cameras");

        var viewIDs = [];

        for(let key in this.scene.graph.views){
            viewIDs.push(key);
        }

        var firstView = {value:this.scene.graph.defaultCamera};

        var parent = this.scene;

        folder.add(firstView, "value", viewIDs).name("View").onChange(
            function () {
                parent.camera = parent.graph.views[firstView.value];
                parent.updateCamera(parent.camera);
            }
        );
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
        //If letter M is clicked, changes materials
        if(this.isKeyPressed('KeyM')){
            this.scene.clickM++;
        }
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode];
    }

    addViews(views){
        var viewsID = [];
        for (var key in views)
          viewsID.push(key);
  
        var controller = this.gui.add(this.scene, 'currentCamera', viewsID).name("Camera");
  
        controller.onChange(function(value){
            this.scene.updateCamera(value);
        });
    }

    createAxisCheckbox() {
        this.gui.add(this.scene, 'axisIsActive');
    }
}