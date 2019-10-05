class MyComponent{
    constructor(scene, id){
        this.scene=scene;
        this.id=id;
    }

    createTextures(texture){
        this.texture = texture;
    }

    createMaterial(material){
        this.material = material;
    }

    createTransformation(matrix){
        this.transformation = matrix;
    }
}