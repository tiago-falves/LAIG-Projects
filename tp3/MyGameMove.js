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
    };

    setAnimation(){
        let t = performance.now()*0.001-0.6;

        let x  = this.originTile.getCoords()[0]-2;
        let y  = this.originTile.getCoords()[1];
        let z  = this.originTile.getCoords()[2]-2;
        let newx  = this.destinationTile.getCoords()[0]-2;
        let newy  = this.destinationTile.getCoords()[1];
        let newz  = this.destinationTile.getCoords()[2]-2;
        
        this.originTile.getPiece().setCoordinates(x-newx,z-newz);
        
        let keyframes = [];

        let keyframe = [];

        keyframe['instant'] = t;
        keyframe['translate'] = vec3.fromValues(0,0,0);
        keyframe['rotate'] = vec3.fromValues(0,0,0);
        keyframe['scale'] = vec3.fromValues(1,1,1);

        let keyframe1 = [];

        keyframe1['instant'] = t+0.5;
        keyframe1['translate'] = vec3.fromValues(0,y+1,0);
        keyframe1['rotate'] = vec3.fromValues(0,0,0);
        keyframe1['scale'] = vec3.fromValues(1,1,1);

        keyframes.push(keyframe1);

        let keyframe2 = [];
        keyframe2['instant'] = t+1;

        keyframe2['translate'] = vec3.fromValues(0,0,0);
        keyframe2['rotate'] = vec3.fromValues(0,0,0);
        keyframe2['scale'] = vec3.fromValues(1,1,1);

        keyframes.push(keyframe2);

        let keyframe3 = [];
        keyframe3['instant'] = t+1.5;

        keyframe3['translate'] = vec3.fromValues(0,0,0);
        keyframe3['rotate'] = vec3.fromValues(0,0,0);
        keyframe3['scale'] = vec3.fromValues(1,1,1);

        keyframes.push(keyframe3);

        this.piece.animation = new MyKeyframeAnimation(this.scene, keyframes);

        this.scene.graph.currentPieceAnimation = this.piece.animation;

    }
}



    




