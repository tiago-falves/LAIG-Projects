class Materials {
    constructor(scene) {
        this.scene = scene;
        this.graph = this.scene.graph;
    }
    getMaterials(children){
        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.graph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.graph.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.graph.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Get shininess
            let shininess = this.graph.reader.getFloat(children[i], 'shininess');
            if(shininess == null)
                return materialID + " has no shininess";

            // Get emission
            let emission = children[i].getElementsByTagName("emission");
            if(emission.length == 0)
                return  materialID + " has no emission paramter";
            else
                emission = this.graph.parseColor(emission[0], "emission in " + materialID + "has an incorrect format");

            // Get ambient
            let ambient = children[i].getElementsByTagName("ambient");
            if(ambient.length == 0){return "no ambient provided for materia with ID: " + materialID;}
            else  ambient = this.graph.parseColor(ambient[0], "ambient in " + materialID + "has an incorrect format");

            // Get diffuse
            let diffuse = children[i].getElementsByTagName("diffuse");
            if(diffuse.length == 0){return "no diffuse provided for materia with ID: " + materialID;}
            else diffuse = this.graph.parseColor(diffuse[0], "diffuse in " + materialID + "has an incorrect format");
            
            // Get specular
            let specular = children[i].getElementsByTagName("specular");
            if(specular.length == 0){ return materialID + "has no specular paramter";}
            else specular = this.graph.parseColor(specular[0], "specular in " + materialID + "has an incorrect format");

            // Creates Material

            let xMaterial = new CGFappearance(this.scene);
            xMaterial.setShininess(shininess);
            xMaterial.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            xMaterial.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            xMaterial.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            xMaterial.setEmission(emission[0], emission[1], emission[2], emission[3]);
            xMaterial.setTextureWrap('REPEAT', 'REPEAT');
            this.graph.materials[materialID] = xMaterial;
        }
    }
}