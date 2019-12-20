class Views {
    constructor(scene) {
        this.scene = scene;
        this.graph = this.scene.graph;
    }
    getViews(viewsNode){
        var children = viewsNode.children;

        if(children.length == 0)
            this.graph.onXMLMinorError("There are no defined views");

        //Gets default Camera
        this.graph.defaultCamera = this.graph.reader.getString(viewsNode, 'default')
        if (this.graph.defaultCamera == null)
            return "no default camera defined";

        //Iterates through all the cameras
        for (let i = 0; i < children.length; i++) {

            let child = children[i];
            let grandChildren= child.children;
            
            let nodeNames = [];
            
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //Cameras can only be of type ortho or perspective
            if (child.nodeName != "perspective" && child .nodeName != "ortho") {
                this.graph.onXMLMinorError("unknown tag <" + child .nodeName + ">");
                continue;
            }
            //Gets view ID of current camera
            var viewId = this.graph.reader.getString(child,'id');
            
            if (viewId == null) 
                return "No cameras"
            
            if (this.graph.camera[viewId] != null) 
                return "Camera IDs cannot be repeated";
            
            
            //Gets correspondent near and far values for this child
            var nearView = this.graph.reader.getFloat(child, 'near');
            var farView = this.graph.reader.getFloat(child, 'far');
            

            if (nearView >= farView) return "Near paramter must be smaller than far paramter";
            

            //Checks if it has the atribute form, returns error if it doesn't
            let fromList = child.getElementsByTagName("from");
            if (fromList.length == 0) {return "Atribute from not provided";}


            //Gets correspondent coordinates of the from atribute
            var fX = this.graph.reader.getFloat(fromList[0], 'x');
            var fY = this.graph.reader.getFloat(fromList[0], 'y');
            var fZ = this.graph.reader.getFloat(fromList[0], 'z');
            
            //Checks if it has the atribute to, returns error if it doesn't
            let toList = child.getElementsByTagName("to");
            if(toList.length == 0) { return"Atribute to not provided!";}

            
            //Gets correspondent coordinates of the to atribute
            var toX = this.graph.reader.getFloat(toList[0], 'x');
            var toY = this.graph.reader.getFloat(toList[0], 'y');
            var toZ = this.graph.reader.getFloat(toList[0], 'z');

            //create object with current View to add to our views array REDO CRIAR OBJETO CGF CAMERA OR CAMERA ORTHO AND SAVE IT ON THE LIST
            let currentView;

        

            //Depending on the view type adds information to current view
            if (child.nodeName == "perspective") {
                //Checks if it has the atribute angle, returns error if it doesn't
                var angleView = this.graph.reader.getFloat(child, 'angle');
                if (angleView == null) {  return "No camera angle provided";  }
                angleView = angleView * DEGREE_TO_RAD;

                currentView = new CGFcamera(angleView, nearView, farView, vec3.fromValues(fX,fY,fZ), vec3.fromValues(toX,toY,toZ));
            }
            else if (child.nodeName == "ortho") {

                //Gets top, bottom, right and left attributes
                var topView = this.graph.reader.getFloat(child, 'top');
                var bottomView = this.graph.reader.getFloat(child, 'bottom');
                var rightView = this.graph.reader.getFloat(child, 'right');
                var leftView = this.graph.reader.getFloat(child, 'left');

                //Checks if they are null
                if (!(topView != null && !isNaN(topView))) {
                    return "unable to parse topView component of the view with ID " + viewId;
                }
                if (!(bottomView != null && !isNaN(bottomView))) {
                    return "unable to parse bottomView component of the view with ID " + viewId;
                }if (!(rightView != null && !isNaN(rightView))) {
                    return "unable to parse rightView component of the view with ID " + viewId;
                }if (!(leftView != null && !isNaN(leftView))) {
                    return "unable to parse leftView component of the view with ID " + viewId;
                }

                //Creates a default up array
                let upList = [0,1,0];

                //Chacks if exists
                let upId = nodeNames.indexOf("up");
                if (grandChildren.length == 3 && upId == -1) {
                    return "unable to get up values, assuming [0,1,0]";
                }
                //If exists parse it
                if (upId !=-1) {
                    upList = this.graph.parseCoordinates3D(grandChildren[upId],"Parsed up views");
                    if (!Array.isArray(upList)) {
                        return upList;
                    }
                }
                //Creates new ortho camera
                currentView = new CGFcameraOrtho(leftView, rightView, bottomView, topView, nearView, farView, vec3.fromValues(fX,fY,fZ), vec3.fromValues(toX,toY,toZ), vec3.fromValues(...upList));
            }
            
            this.graph.views[viewId] = currentView;
            
            //if it is the default camera, we update the view
            if(viewId == this.graph.defaultCamera)
                this.scene.updateCamera(currentView);
            
        }
    }
}