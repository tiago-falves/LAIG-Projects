class MyGameMove extends CGFobject {
    /**
     * Constructor of the class MyGameMove.
     * @param {CGFscene} scene Scene of the application.
     */
    constructor(scene,piece,originTile,destinationTile,board) {
        super(scene);
        this.scene;
        this.piece = piece;
        this.originTile = originTile;
        this.destinationTile = destinationTile;
        this.oldPiece = destinationTile.getPiece();
        this.board = board;
        this.animation = null;
        this.setAnimation();

        

        // this.animation = new MyKeyframeAnimation(this.scene,)

    };

    // <keyframe instant="3">
    //             <translate x="0" y="4" z="7" />
    //             <rotate angle_x="-45" angle_y="-45" angle_z="20" />
    //             <scale x="2" y="2" z="2" />
    //         </keyframe>
    //         <keyframe instant="5">
    //             <translate x="-8" y="5" z="7" />
    //             <rotate angle_x="12" angle_y="-90" angle_z="90" />
    //             <scale x="2" y="2" z="2" />
    //         </keyframe> 
    //          <keyframe instant="7">
    //             <translate x="-8" y="4" z="0" />
    //             <rotate angle_x="0" angle_y="-180" angle_z="120" />
    //             <scale x="1" y="1" z="1" />
    //         </keyframe>
       
    //         <keyframe instant="12">
    //             <translate x="-8" y="3" z="-3" />
    //             <rotate angle_x="0" angle_y="90" angle_z="0" />
    //             <scale x="1" y="1" z="1" />

    //         </keyframe>
    //         <keyframe instant="17">
    //             <translate x="0" y="3" z="-5" />
    //             <rotate angle_x="45" angle_y="0" angle_z="0" />
    //             <scale x="1" y="1" z="1" />
    //         </keyframe>
    //         <keyframe instant="19">
    //             <translate x="0" y="0" z="0" />
    //             <rotate angle_x="0" angle_y="0" angle_z="0" />
    //             <scale x="1" y="1" z="1" />
    //         </keyframe>

    animate(){
        this.scene.graph.currentPieceAnimation = this.animation;
    }
    
    setAnimation(){
    
        let keyframes = [];
        let keyframe = [];
        keyframe['instant'] = 5;

        keyframe['translate'] = vec3.fromValues(this.originTile.getCoords()[0],this.originTile.getCoords()[1]+5,this.originTile.getCoords()[2]);
        keyframe['rotate'] = vec3.fromValues(0,0,0);
        keyframe['scale'] = vec3.fromValues(1,1,1);

        keyframes.push(keyframe);

        let keyframe1 = [];
        keyframe1['instant'] = 7;

        keyframe1['translate'] = vec3.fromValues(this.destinationTile.getCoords()[0],this.destinationTile.getCoords()[1]+5,this.destinationTile.getCoords()[2]);
        keyframe1['rotate'] = vec3.fromValues(0,0,0);
        keyframe1['scale'] = vec3.fromValues(1,1,1);

        keyframes.push(keyframe1);

        this.animation = new MyKeyframeAnimation(this.scene, keyframes);





    }



}



    




