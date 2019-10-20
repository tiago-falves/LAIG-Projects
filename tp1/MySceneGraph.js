var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);

        this.scene.clickM = 0;
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        var children = viewsNode.children;
        this.camera = [];
        this.views = [];

        if(children.lenght == 0){
            this.onXMLMinorError("There are no defined views");
        }

        this.defaultCamera = this.reader.getString(viewsNode, 'default')
        if (this.defaultCamera == null)
            return "no default camera defined";

        for (let i = 0; i < children.length; i++) {

            let child = children[i];
            let grandChildren= child.children;
            
            let nodeNames = [];
            
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            
            if (child.nodeName != "perspective" && child .nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + child .nodeName + ">");
                continue;
            }
            
            var viewId = this.reader.getString(child,'id');
            
            if (viewId == null) 
                return "No cameras"
            
            if (this.camera[viewId] != null) 
                return "Camera IDs cannot be repeated";
            
            
            //Gets correspondent near and far values for this child
            var nearView = this.reader.getFloat(child, 'near');
            var farView = this.reader.getFloat(child, 'far');
            

            if (nearView >= farView) return "Near paramter must be smaller than far paramter";
            

            //Checks if it has the atribute form, returns error if it doesn't
            let fromList = child.getElementsByTagName("from");
            if (fromList.lenght == 0) {return "Atribute from not provided";}


            //Gets correspondent coordinates of the from atribute
            var fX = this.reader.getFloat(fromList[0], 'x');
            var fY = this.reader.getFloat(fromList[0], 'y');
            var fZ = this.reader.getFloat(fromList[0], 'z');
            
            //Checks if it has the atribute to, returns error if it doesn't
            let toList = child.getElementsByTagName("to");
            if(toList.length == 0) { return"Atribute to not provided!";}

            
            //Gets correspondent coordinates of the to atribute
            var toX = this.reader.getFloat(toList[0], 'x');
            var toY = this.reader.getFloat(toList[0], 'y');
            var toZ = this.reader.getFloat(toList[0], 'z');

            //create object with current View to add to our views array REDO CRIAR OBJETO CGF CAMERA OR CAMERA ORTHO AND SAVE IT ON THE LIST
            let currentView;

           

            //Depending on the view type adds information to current view
            if (child.nodeName == "perspective") {
                 //Checks if it has the atribute angle, returns error if it doesn't
                var angleView = this.reader.getFloat(child, 'angle');
                if (angleView == null) {  return "No camera angle provided";  }
                angleView = angleView * DEGREE_TO_RAD;

                currentView = new CGFcamera(angleView, nearView, farView, vec3.fromValues(fX,fY,fZ), vec3.fromValues(toX,toY,toZ));
            }
            else if (child.nodeName == "ortho") {
                var topView = this.reader.getFloat(child, 'top');
                var bottomView = this.reader.getFloat(child, 'bottom');
                var rightView = this.reader.getFloat(child, 'right');
                var leftView = this.reader.getFloat(child, 'left');

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

                let upList = [0,1,0];
                let upId = nodeNames.indexOf("up");
                if (grandChildren.length == 3 && upId == -1) {
                    return "unable to get up values, assuming [0,1,0]";
                }
                if (upId !=-1) {
                    upList = this.parseCoordinates3D(grandChildren[upId],"Parsed up views");
                    if (!Array.isArray(upList)) {
                        return upList;
                    }
                }
                
                currentView = new CGFcameraOrtho(leftView, rightView, bottomView, topView, nearView, farView, vec3.fromValues(fX,fY,fZ), vec3.fromValues(toX,toY,toZ), vec3.fromValues(...upList));
            }
            
            this.views[viewId] = currentView;
            
            if(viewId == this.defaultCamera)
                this.scene.updateCamera(currentView);
            
        }
        if ( Object.keys(this.views).length == 0) { return "Views not loaded";}
        return null;

    }

    
    /**
     * Parses the <global> node.
     * @param {global block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else if (attributeTypes[j] == "color")
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    
                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            let attenuation = nodeNames.indexOf('attenuation');
            if (attenuation == null) {
                return "Unable to get attenuation";     
            }

            let constant = this.reader.getFloat(grandChildren[attenuation],'constant');
            if (constant == null) {return "Unable to parse constant attenuation"; }

            let linear = this.reader.getFloat(grandChildren[attenuation],'linear');
            if (linear == null) {return "Unable to parse linear attenuation"; }

            let quadratic = this.reader.getFloat(grandChildren[attenuation],'quadratic');
            if (quadratic == null) {return "Unable to parse quadratic attenuation"; }
            var aux = [constant,linear,quadratic];
            global.push(...[constant,linear,quadratic]);
            

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        this.textures = [];
        
        
        if(children.length == 0)
            return "No Textures in file";


        //Iterates for each Texture
        for (let i = 0; i < children.length; i++) {
            
            if (children[i].nodeName != "texture") {
                return "unknown texture tag " + children[i].nodeName;
            }
            
            //Gets corresponding ID
            var textureId = this.reader.getString(children[i], 'id');

            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + textureID + ")";
            

            //Gets the file path
            var filePath = this.reader.getString(children[i], 'file');

            if (filePath == null)   {
                this.onXMLMinorError("no file defined for texture");
            }
            
            //Creates Texture and adds it to the array
            var new_texture = new CGFtexture(this.scene, filePath);
            this.textures[textureId] = new_texture;
        }

        //For each texture in textures block, check ID and file URL
        this.log("Textures Parsed successfully")
        return null;

      

    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

       var children = materialsNode.children;

        this.materials = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Get shininess
            let shininess = this.reader.getFloat(children[i], 'shininess');
            if(shininess == null)
                return materialID + " has no shininess";

            // Get emission
            let emission = children[i].getElementsByTagName("emission");
            if(emission.length == 0)
                return  materialID + " has no emission paramter";
            else
                emission = this.parseColor(emission[0], "emission in " + materialID + "has an incorrect format");

            // Get ambient
            let ambient = children[i].getElementsByTagName("ambient");
            if(ambient.length == 0){return "no ambient provided for materia with ID: " + materialID;}
            else  ambient = this.parseColor(ambient[0], "ambient in " + materialID + "has an incorrect format");

            // Get diffuse
            let diffuse = children[i].getElementsByTagName("diffuse");
            if(diffuse.length == 0){return "no diffuse provided for materia with ID: " + materialID;}
            else diffuse = this.parseColor(diffuse[0], "diffuse in " + materialID + "has an incorrect format");
            
            // Get specular
            let specular = children[i].getElementsByTagName("specular");
            if(specular.length == 0){ return materialID + "has no specular paramter";}
            else specular = this.parseColor(specular[0], "specular in " + materialID + "has an incorrect format");

            // Creates Material

            let xMaterial = new CGFappearance(this.scene);
            xMaterial.setShininess(shininess);
            xMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            xMaterial.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            xMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            xMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
            xMaterial.setTextureWrap('REPEAT', 'REPEAT');
            this.materials[materialID] = xMaterial;
        }

        this.log("Parsed materials");
        return null;
    
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;
        this.transformations = [];
        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':                        
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'rotate':
                        let axis = this.reader.getString(grandChildren[j], 'axis');
                        let angle = this.reader.getFloat(grandChildren[j], 'angle'); 
                        let vector;

                        switch(axis){
                            case 'x':
                                vector = [1, 0, 0];
                                break;
                            case 'y':
                                vector = [0, 1, 0];
                                break;
                            case 'z':
                                vector = [0, 0, 1];
                                break;
                        }
                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle*DEGREE_TO_RAD, vector);
                }
            }

            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'prism' )) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus or prism)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (x1 ==null)
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (y1 == null)
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (x2 == null)
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (y2 == null )
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if(primitiveType == 'cylinder'){

                //Cylinder base radius
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                //Cylinder Top radius
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
                //Height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                //Slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;    

                //Stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;    

                //Creates cylinder and adds it to the primitives
                var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);
                this.primitives[primitiveId] = cylinder;
            }

            else if(primitiveType == 'sphere'){

                //Radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');

                //Slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');

                //Stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');

                //Creates shere and adds it to the primitive array
                var sphere = new MySphere(this.scene, radius, slices, stacks);
                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');

                //Creates Triangle and adds it to primitive array
                var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                this.primitives[primitiveId] = triangle;
            }

            else if(primitiveType == 'torus'){

                //Inner Radius, the one of the circle which goes around
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
               
                //Outer Radius, from the center to the center of the inner Radius
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;
                
                //Slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //Loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;    

                //Creates Torus and adds it to the primitive array
                var torus = new MyTorus(this.scene, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //Gets correspondent IDs
            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            //create new component
            let component = new MyComponent(this.scene, componentID);
            let transformations = grandChildren[transformationIndex].children;
            let matrix_transformation = mat4.create();
           
            for (let j = 0; j < transformations.length; j++) {
                let coordinates = [];
                switch(transformations[j].nodeName){
                    case "translate":
                        coordinates = this.parseCoordinates3D(transformations[j], "translate transformation for ID " + transformationIndex);
                        matrix_transformation = mat4.translate(matrix_transformation, matrix_transformation, coordinates);
                        break;
                    case "scale":
                        coordinates = this.parseCoordinates3D(transformations[j], "scale transformation for ID " + transformationIndex);
                        matrix_transformation = mat4.scale(matrix_transformation, matrix_transformation, coordinates);
                        break;
                        
                    case "rotate":
                        let axis = this.reader.getString(transformations[j], 'axis');
                        let angle = this.reader.getFloat(transformations[j], 'angle'); 
                        let vector;

                        switch(axis){
                            case 'x':
                                vector = [1, 0, 0];
                                break;
                            case 'y':
                                vector = [0, 1, 0];
                                break;
                            case 'z':
                                vector = [0, 0, 1];
                                break;
                        }
                        matrix_transformation = mat4.rotate(matrix_transformation, matrix_transformation, angle*DEGREE_TO_RAD, vector);
                        break;
                    case "transformationref":
                        let transfRef = this.reader.getString(transformations[j],'id');
                        if (this.transformations[transfRef] == null) {
                            return "Unable to get transformation reference";
                        }
                        matrix_transformation = mat4.multiply(matrix_transformation,matrix_transformation,this.transformations[transfRef]);
                        break;
                }
            }
            
            component.createTransformation(matrix_transformation);
            

            // Materials

            var materials = grandChildren[materialsIndex].children;
            var materialIDs = [];
            
            //Iterates all the Materials

            for (let j = 0; j < materials.length; j++) {

                //Gets Material ID
                materialIDs.push(this.reader.getString(materials[j],'id'));

                if (materialIDs == null){
                    this.onXMLMinorError("Component has no ID: " + componentID );
                }
                else {component.createMaterial(materialIDs);}
            }

           
            
            // Texture
            let texture = this.reader.getString(grandChildren[textureIndex],'id');
            let length_s;
            let length_t;

            if (texture == null) this.onXMLMinorError('Unable to parse Texture id');
            if (componentID == this.idRoot && texture == "inherit") {
                return "Root component ID " + componentID + " cannot inherit texture";
            }
            if(texture == 'inherit' || texture == 'none'){
                if(this.reader.hasAttribute(grandChildren[textureIndex], 'length_s') || this.reader.hasAttribute(grandChildren[textureIndex], 'length_t')){
                    this.onXMLMinorError(`Length_s and length_t should not be defined for ${texture} type`);
                }
            }
            else if(this.reader.hasAttribute(grandChildren[textureIndex], 'length_s') || this.reader.hasAttribute(grandChildren[textureIndex], 'length_t')){

                length_s = this.reader.getFloat(grandChildren[textureIndex],'length_s');
                length_t = this.reader.getFloat(grandChildren[textureIndex],'length_t');
            }
            else{

                this.onXMLMinorError(`Length_s and length_t  not be defined, assuming length_s=1 and length_t =1`);
                length_s=1;
                length_t = 1;
            }

            component.createTextures(texture, length_s, length_t);
            
            // Children
            let component_children = grandChildren[childrenIndex].children;
            let childrenIDs = [];
            
            for (let j = 0; j < component_children.length; j++) {
                childrenIDs.push(this.reader.getString(component_children[j],'id'));
            }        

            component.createChildren(childrenIDs);

            //Adds component with all attributes to the array
            this.components[componentID] = component;
        }  
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        let position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph

        this.processNode(this.idRoot, null, null, 1, 1);
    }

    processNode(idNode, matParent, texParent, lsParent, ltParent){
        if(idNode){
            //materials
            let material;
            let materialID = this.components[idNode].materials[this.scene.clickM % this.components[idNode].materials.length]; // 0 -> clickM % materials.length
            if(materialID == "inherit"){
                materialID = matParent;
            }

            material = this.materials[materialID];

            let textureID = this.components[idNode].texture;
            
            let length_s = this.components[idNode].length_s;
            let length_t = this.components[idNode].length_t;

            if(textureID == "inherit"){
                textureID = texParent;
                length_s = lsParent;
                length_t = ltParent;
            }
            else if(textureID == "none"){
                textureID = null;
            }
            

            material.setTexture(this.textures[textureID]);

            material.apply();

            this.scene.pushMatrix();
            this.scene.multMatrix(this.components[idNode].transformation);

            let children = this.components[idNode].children;

            for(let i = 0; i < children.length; i++){
                if(this.components[children[i]])
                    this.processNode(children[i], materialID, textureID, length_s, length_t);
                else if(this.primitives[children[i]]){
                    this.primitives[children[i]].updateTexCoords(length_s,length_t);   

                    this.primitives[children[i]].display();
                }
            }
            this.scene.popMatrix();
        }
    } 
}