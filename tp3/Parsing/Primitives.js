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
                    grandChildren[0].nodeName != 'torus'  && grandChildren[0].nodeName != 'plane' && grandChildren[0].nodeName != 'patch' 
                    && grandChildren[0].nodeName != 'cylinder2' && grandChildren[0].nodeName != 'board' && grandChildren[0].nodeName != 'piece')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch,board  or cylinder2)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle' || primitiveType == 'board') {
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

                if(primitiveType == 'rectangle'){
                    var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);
                    this.graph.primitives[primitiveId] = rect;
                }
                if(primitiveType == 'board'){
                    var board = new MyGameBoard(this.scene);
                    this.graph.primitives[primitiveId] = board;
                }
            }
            else if(primitiveType == 'cylinder'|| primitiveType == 'cylinder2'){

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
                if(primitiveType == 'cylinder')  {  
                    //Creates cylinder and adds it to the primitives
                    let cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);
                    this.graph.primitives[primitiveId] = cylinder;
                }
                else if(primitiveType == 'cylinder2'){
                    let cylinder2 = new Cylinder2(this.scene,base,top,height,slices,stacks);
                    this.graph.primitives[primitiveId] = cylinder2;
                }
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

            /*else if(primitiveType == 'piece'){

                //Team
                var team = this.graph.reader.getString(grandChildren[0], 'team');

                //Nature
                var nature = this.graph.reader.getString(grandChildren[0], 'nature');

                //Creates shere and adds it to the primitive array
                var piece = new ChameleonPiece(this.scene, team, nature,);
                this.graph.primitives[primitiveId] = piece;
            }*/
            
            else if (primitiveType == 'plane') {
                let npartsU = this.graph.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                let npartsV = this.graph.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;
                    
                let plane = new Plane(this.scene,primitiveId,npartsU,npartsV);
                this.graph.primitives[primitiveId] = plane;


            }
            else if(primitiveType == 'patch'){

                let npartsU = this.graph.reader.getFloat(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                let npartsV = this.graph.reader.getFloat(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                        return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                let npointsU = this.graph.reader.getFloat(grandChildren[0],'npointsU');
                if (!(npointsU != null && !isNaN(npointsU)))
                    return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

                let npointsV = this.graph.reader.getFloat(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

                let controlpoints = grandChildren[0].children;

                let uPoints = [];
                for(let j = 0; j < npointsU; j++) {
                    let vPoints = [];
                    for(let k = 0; k < npointsV; k++) {
                        vPoints.push([
                            this.graph.reader.getFloat(controlpoints[j*npointsV+k], 'xx'),
                            this.graph.reader.getFloat(controlpoints[j*npointsV+k], 'yy'),
                            this.graph.reader.getFloat(controlpoints[j*npointsV+k], 'zz'),
                            1.0
                        ]);
                    }
                    uPoints.push(vPoints);
                }
                let patch = new Patch(this.scene,primitiveId,npartsU,npartsV,npointsU,npointsV,uPoints);
                this.graph.primitives[primitiveId] = patch;
            }

        }
        console.log("Parsed primitives");
        return null;
    }
}