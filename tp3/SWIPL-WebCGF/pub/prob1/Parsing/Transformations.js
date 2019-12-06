class Transformations extends CGFobject {
	constructor(scene) {
        super(scene);
        this.graph = this.scene.graph;
    }
    getTransformationMatrix(transformations, transformationIndex){
        let matrix_transformation = mat4.create();
           
        for (let j = 0; j < transformations.length; j++) {
            let coordinates = [];
            switch(transformations[j].nodeName){
                case "translate":
                    coordinates = this.graph.parseCoordinates3D(transformations[j], "translate transformation for ID " + transformationIndex);
                    matrix_transformation = mat4.translate(matrix_transformation, matrix_transformation, coordinates);
                    break;
                case "scale":
                    coordinates = this.graph.parseCoordinates3D(transformations[j], "scale transformation for ID " + transformationIndex);
                    matrix_transformation = mat4.scale(matrix_transformation, matrix_transformation, coordinates);
                    break;
                    
                case "rotate":
                    let axis = this.graph.reader.getString(transformations[j], 'axis');
                    let angle = this.graph.reader.getFloat(transformations[j], 'angle'); 
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
                case "transformationref": //this case applies only to transformations references on the components parsing
                    let transfRef = this.graph.reader.getString(transformations[j],'id');
                    if (this.graph.transformations[transfRef] == null) {
                        return "Unable to get transformation reference";
                    }
                    matrix_transformation = mat4.multiply(matrix_transformation,matrix_transformation,this.graph.transformations[transfRef]);
                    break;
            }
        }

        return matrix_transformation;
    }
}