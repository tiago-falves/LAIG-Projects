class Primitives extends CGFobject {
	constructor(scene) {
        super(scene);
        this.scene = scene;
        this.graph = this.scene.graph;
    }

    getPrimitives(children){
        var grandChildren = [];
        
        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.graph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.graph.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.graph.primitives[primitiveId] != null)
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
                var x1 = this.graph.reader.getFloat(grandChildren[0], 'x1');
                if (x1 ==null)
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.graph.reader.getFloat(grandChildren[0], 'y1');
                if (y1 == null)
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.graph.reader.getFloat(grandChildren[0], 'x2');
                if (x2 == null)
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.graph.reader.getFloat(grandChildren[0], 'y2');
                if (y2 == null )
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.graph.primitives[primitiveId] = rect;
            }
            else if(primitiveType == 'cylinder'){

                //Cylinder base radius
                var base = this.graph.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                //Cylinder Top radius
                var top = this.graph.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
                //Height
                var height = this.graph.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                //Slices
                var slices = this.graph.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;    

                //Stacks
                var stacks = this.graph.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;    

                //Creates cylinder and adds it to the primitives
                var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);
                this.graph.primitives[primitiveId] = cylinder;
            }

            else if(primitiveType == 'sphere'){

                //Radius
                var radius = this.graph.reader.getFloat(grandChildren[0], 'radius');

                //Slices
                var slices = this.graph.reader.getFloat(grandChildren[0], 'slices');

                //Stacks
                var stacks = this.graph.reader.getFloat(grandChildren[0], 'stacks');

                //Creates shere and adds it to the primitive array
                var sphere = new MySphere(this.scene, radius, slices, stacks);
                this.graph.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.graph.reader.getFloat(grandChildren[0], 'x1');

                // y1
                var y1 = this.graph.reader.getFloat(grandChildren[0], 'y1');

                // z1
                var z1 = this.graph.reader.getFloat(grandChildren[0], 'z1');

                // x2
                var x2 = this.graph.reader.getFloat(grandChildren[0], 'x2');

                // y2
                var y2 = this.graph.reader.getFloat(grandChildren[0], 'y2');

                // z2
                var z2 = this.graph.reader.getFloat(grandChildren[0], 'z2');

                // x3
                var x3 = this.graph.reader.getFloat(grandChildren[0], 'x3');

                // y3
                var y3 = this.graph.reader.getFloat(grandChildren[0], 'y3');

                // z3
                var z3 = this.graph.reader.getFloat(grandChildren[0], 'z3');

                //Creates Triangle and adds it to primitive array
                var triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                this.graph.primitives[primitiveId] = triangle;
            }

            else if(primitiveType == 'torus'){

                //Inner Radius, the one of the circle which goes around
                var inner = this.graph.reader.getFloat(grandChildren[0], 'inner');
               
                //Outer Radius, from the center to the center of the inner Radius
                var outer = this.graph.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;
                
                //Slices
                var slices = this.graph.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //Loops
                var loops = this.graph.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;    

                //Creates Torus and adds it to the primitive array
                var torus = new MyTorus(this.scene, inner, outer, slices, loops);
                this.graph.primitives[primitiveId] = torus;
            }
        }
    }
}