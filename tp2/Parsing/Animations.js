class Animations {
    constructor(scene) {
        this.scene = scene;
        this.graph = this.scene.graph;
    }
    getAnimations(children){
        for(let i = 0; i < children.length; i++){
            console.log(children[i])
            if (children[i].nodeName != "animation") {
                this.graph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            
            let animationID = this.graph.reader.getString(children[i], 'id');

            if (animationID == null){
                this.graph.onXMLMinorError("no ID defined for this animation");
                continue;
            }

            if (this.graph.animations[animationID] != null){
                this.graph.onXMLMinorError("ID must be unique for each animation (conflict: ID = " + animationID + ")");
                continue;
            }
                
            let grandChildren = children[i].children;  
            let keyframes = [];

            for(let j = 0; j < grandChildren.length; j++){
                let keyframe = [];

                if(grandChildren[j].nodeName != "keyframe"){
                    this.graph.onXMLMinorError("Incorrect name for node where keyframe should be at animation " + animationID);
                    continue;
                }

                let keyframeINSTANT = this.graph.reader.getFloat(grandChildren[j], 'instant');

                if(keyframeINSTANT == null){
                    this.graph.onXMLMinorError("Unable to read instant in keyframe number " + j + " of animation " + animationID);
                    continue;    
                }

                keyframe['instant'] = keyframeINSTANT;

                let transformations = grandChildren[j].children;
                
                if(transformations.length != 3){
                    this.graph.onXMLMinorError("Wrong number of transformations in animation " + animationID);
                    continue; 
                }
                
                let coordinates = [];

                //translate
                if(transformations[0].nodeName != 'translate'){
                    this.graph.onXMLMinorError("Wrong transformation in translate position in keyframe number " + j + " of animation " + animationID);
                    continue; 
                }
                else{
                    coordinates = this.graph.parseCoordinates3D(transformations[0], "translate transformation");
                    keyframe['translate'] = vec3.fromValues(coordinates[0],coordinates[1],coordinates[2]);
                }

                //rotate
                if(transformations[1].nodeName != 'rotate'){
                    this.graph.onXMLMinorError("Wrong transformation in rotate position in keyframe number " + j + " of animation " + animationID);
                    continue; 
                }
                else{
                    let angle_x = this.graph.reader.getFloat(transformations[1], 'angle_x');
                    let angle_y = this.graph.reader.getFloat(transformations[1], 'angle_y');
                    let angle_z = this.graph.reader.getFloat(transformations[1], 'angle_z');

                    keyframe['rotate'] = vec3.fromValues(angle_x, angle_y, angle_z);
                }

                //scale
                if(transformations[2].nodeName != 'scale'){
                    this.graph.onXMLMinorError("Wrong transformation in scale position in keyframe number " + j + " of animation " + animationID);
                    continue; 
                }
                else{
                    coordinates = this.graph.parseCoordinates3D(transformations[2], "scale transformation");
                    keyframe['scale'] = vec3.fromValues(coordinates[0],coordinates[1],coordinates[2]);
                }

                keyframes.push(keyframe);
            }

            this.graph.animations[animationID] = new MyKeyframeAnimation(this.scene, keyframes);

            console.log(this.graph.animations);
        }
    }
}