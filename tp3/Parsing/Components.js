class Components {
    constructor(scene) {
        this.scene = scene;
        this.graph = this.scene.graph;
    }
    getComponents(children){
        var grandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.graph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.graph.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.graph.components[componentID] != null)
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
            var animationIndex = nodeNames.indexOf("animationref");
            var childrenIndex = nodeNames.indexOf("children");

            //create new component
            let component = new MyComponent(this.scene, componentID);

            let transformations = grandChildren[transformationIndex].children;
            
            component.createTransformation(this.graph.getTransformationMatrix(transformations, transformationIndex));
            

            // Materials

            var materials = grandChildren[materialsIndex].children;
            var materialIDs = [];
            
            //Iterates all the Materials

            for (let j = 0; j < materials.length; j++) {

                //Gets Material ID
                materialIDs.push(this.graph.reader.getString(materials[j],'id'));

                if (materialIDs == null){
                    this.graph.onXMLMinorError("Component has no ID: " + componentID );
                }
                else {component.createMaterial(materialIDs);}
            }
            
            // Texture
            let texture = this.graph.reader.getString(grandChildren[textureIndex],'id');
            let length_s;
            let length_t;

            if (texture == null) this.graph.onXMLMinorError('Unable to parse Texture id');
            if (componentID == this.graph.idRoot && texture == "inherit") {
                return "Root component ID " + componentID + " cannot inherit texture";
            }
            if(texture == 'inherit' || texture == 'none'){ //no length_s or t must be applied when texture is inherited or inexistent
                if(this.graph.reader.hasAttribute(grandChildren[textureIndex], 'length_s') || this.graph.reader.hasAttribute(grandChildren[textureIndex], 'length_t')){
                    this.graph.onXMLMinorError(`Length_s and length_t should not be defined for ${texture} type`);
                }
            }
            else if(this.graph.reader.hasAttribute(grandChildren[textureIndex], 'length_s') || this.graph.reader.hasAttribute(grandChildren[textureIndex], 'length_t')){

                length_s = this.graph.reader.getFloat(grandChildren[textureIndex],'length_s');
                length_t = this.graph.reader.getFloat(grandChildren[textureIndex],'length_t');
            }
            else{ //when a texture referes no length s or t, we assume the values 1 for both

                this.graph.onXMLMinorError(`Length_s and length_t  not be defined, assuming length_s=1 and length_t =1`);
                length_s=1;
                length_t = 1;
            }

            component.createTextures(texture, length_s, length_t); //add texture
            
            //animation
            if(animationIndex != -1){
                let animationID = this.graph.reader.getString(grandChildren[animationIndex],'id');
                if (animationID == null) this.graph.onXMLError('Unable to get animation id.');
                else{
                    if(this.graph.animations[animationID] == null) this.graph.onXMLError('There is no animation available with this id.');
                    else{
                        if (this.graph.reader.getString(grandChildren[animationIndex],'loop') == null)
                            this.graph.onXMLMinorError('There is no loop in this animation.');
                        else this.graph.animations[animationID].loop = true;
                    }

                    component.createAnimation(this.graph.animations[animationID]);
                } 
            }

            // Children
            let component_children = grandChildren[childrenIndex].children;
            let childrenIDs = [];
            
            for (let j = 0; j < component_children.length; j++) {
                childrenIDs.push(this.graph.reader.getString(component_children[j],'id'));
            }        

            component.createChildren(childrenIDs); //register the components children

            //Adds component with all attributes to the array
            this.graph.components[componentID] = component;
        }  
    }
}