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

        this.createOptionsFolder();

        this.createModeFolder();

        this.initKeys();
    }

    //Adds lights Menu
    createLightFolder(){
        var folder = this.gui.addFolder("Lights");

        for(let key in this.scene.graph.lights){
            folder.add(this.scene.graph.lights[key], "0").name(key);
        }
    }

    createOptionsFolder(){
        var folder = this.gui.addFolder("Options");
       // folder.add(this.scene, "undoMove").name("Undo move");
        folder.add(this.scene, "movie").name("Replay Game");


    }

    createScenesFolder(){
        var folder = this.gui.addFolder("Scene");
        let scene = this.scene;
        folder.add(this.scene, "currentScene" , ["room", "space", "quidditch"]).name("Current Scene").onChange(function(value) {
            let scenario = value + ".xml";
            scene.graph.changeScene(scenario);
        });
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

    //Add Camera checkboxes
    createModeFolder(){
        var folder = this.gui.addFolder("Mode");

        var modeIDs = [];

        modeIDs.push("Player VS Player");
        modeIDs.push("Player VS Machine");

        var firstMode = {value:"Player VS Player"};

        var parent = this.scene;

        folder.add(firstMode, "value", modeIDs).name("Mode").onChange(
            function () {
                parent.mode = firstMode.value;
            }
        );

        let difficultyIDs = ["Wall-E", "C-3PO", "Terminator", "Deus Ex Machina"]

        let firstDifficulty = {value: "Wall-E"}

        folder.add(firstDifficulty, "value", difficultyIDs).name("Difficulty").onChange(
            function () {
                parent.difficulty = firstDifficulty.value;
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