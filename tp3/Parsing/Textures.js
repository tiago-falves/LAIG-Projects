class Textures {
    constructor(scene) {
        this.scene = scene;
        this.graph = this.scene.graph;
    }
    getTextures(children){
        if(children.length == 0)
            return "No Textures in file";

        //Iterates for each Texture
        for (let i = 0; i < children.length; i++) {

        if (children[i].nodeName != "texture") {
            return "unknown texture tag " + children[i].nodeName;
        }

        //Gets corresponding ID
        var textureId = this.graph.reader.getString(children[i], 'id');

        if (textureId == null)
            return "no ID defined for texture";

        // Checks for repeated IDs.
        if (this.graph.textures[textureId] != null)
            return "ID must be unique for each primitive (conflict: ID = " + textureID + ")";


        //Gets the file path
        var filePath = this.graph.reader.getString(children[i], 'file');

        if (filePath == null)   {
            this.graph.onXMLMinorError("no file defined for texture");
        }

        //Creates Texture and adds it to the array
        var new_texture = new CGFtexture(this.scene, filePath);
        this.graph.textures[textureId] = new_texture;
        }
    }
}