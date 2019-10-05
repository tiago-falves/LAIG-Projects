class MyComponent{
    constructor(scene, id){
        this.scene=scene;
        this.id=id;
    }

    createTextures(texture){
        this.textures = texture;
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