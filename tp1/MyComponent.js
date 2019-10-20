class MyComponent{
    constructor(scene, id){
        this.scene=scene;
        this.id=id;
    }

    createTextures(texture, length_s, length_t){
        this.texture = texture;
        this.length_s = length_s;
        this.length_t = length_t;
    }

    createMaterial(material){
        this.materials = material;
    }

    createTransformation(matrix){
        this.transformation = matrix;
    }

    createChildren(children){
        this.children = children;
    }
}
