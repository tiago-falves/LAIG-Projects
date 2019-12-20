class MyKeyframeAnimation extends MyAnimation {
    /**
     * @constructor
     */
    constructor(scene, keyframes) {
        super();
        this.scene = scene;
        this.keyframes = keyframes;

        let firstKeyframe = [];
        firstKeyframe.instant = 0;
        firstKeyframe['translate'] = vec3.fromValues(0, 0, 0);
        firstKeyframe['scale'] = vec3.fromValues(1, 1, 1);
        firstKeyframe['rotate'] = vec3.fromValues(0, 0, 0);

        this.keyframes.unshift(firstKeyframe);

        this.resultMatrix = mat4.create();

        this.currentKeyframe = firstKeyframe;
        this.previousKF = 0;
        this.nextKF = 1;
        this.end_animation = false;
        this.loop = false;
        this.initialTime = 0;
    }

    updateInitialTime(time) {
        this.initialTime = time;
    }

    update(t) {
        let time = (t - this.initialTime)/1000; 

        if (this.end_animation) {
            return;
        }

        while (time >= this.keyframes[this.nextKF]['instant']) {
            this.previousKF++;
            this.nextKF++;

            if (this.nextKF == this.keyframes.length) {
                if(this.loop){
                    this.previousKF = 0;
                    this.nextKF = 1;
                    this.initialTime = t;

                    time = 0;
                }
                else{
                    this.end_animation = true;
                    return;
                }
            }
        }

        this.resultMatrix = mat4.create();

        let coordinates = this.AditiveInterpolation(time, 'translate');
        this.resultMatrix = mat4.translate(this.resultMatrix, this.resultMatrix, coordinates);

        coordinates = this.AditiveInterpolation(time, 'rotate');
        this.resultMatrix = mat4.rotate(this.resultMatrix, this.resultMatrix, coordinates[0]*DEGREE_TO_RAD, [1,0,0]);
        this.resultMatrix = mat4.rotate(this.resultMatrix, this.resultMatrix, coordinates[1]*DEGREE_TO_RAD, [0,1,0]);
        this.resultMatrix = mat4.rotate(this.resultMatrix, this.resultMatrix, coordinates[2]*DEGREE_TO_RAD, [0,0,1]);

        coordinates = this.MultiplicativeInterpolation(time);
        this.resultMatrix = mat4.scale(this.resultMatrix, this.resultMatrix, coordinates);
    }

    AditiveInterpolation(time, transformationID) {
        let StartTransformation = this.keyframes[this.previousKF][transformationID];
        let startTime = this.keyframes[this.previousKF]['instant'];
        let EndTransformation = this.keyframes[this.nextKF][transformationID];
        let endTime = this.keyframes[this.nextKF]['instant'];

        //R = Ri + (time - ti)*(Rf - Ri)/(tf - ti)
        let intermediumStep = vec3.create();
        vec3.subtract(intermediumStep, EndTransformation, StartTransformation);
        let timeReason = (time - startTime) / (endTime - startTime);
        intermediumStep = vec3.scale(intermediumStep, intermediumStep, timeReason);

        return vec3.add(intermediumStep, intermediumStep, StartTransformation);
    }

    MultiplicativeInterpolation(time) {
        let StartTransformation = this.keyframes[this.previousKF]['scale'];
        let EndTransformation = this.keyframes[this.nextKF]['scale'];
        let n = (this.keyframes[this.nextKF]['instant'] - this.keyframes[this.previousKF]['instant'])*30;

        //S0.r^n = S1
        let intermediumStep = vec3.fromValues(EndTransformation[0]/StartTransformation[0], EndTransformation[1]/StartTransformation[1], EndTransformation[2]/StartTransformation[2]);
        let r = vec3.fromValues(Math.pow(intermediumStep[0], 1/n), Math.pow(intermediumStep[1], 1/n), Math.pow(intermediumStep[2], 1/n));

        let k = 30*(time - this.keyframes[this.previousKF]['instant']);

        return vec3.fromValues(StartTransformation[0]*Math.pow(r[0], k), StartTransformation[1]*Math.pow(r[1], k), StartTransformation[2]*Math.pow(r[2], k));
    }

    apply() {
        this.scene.multMatrix(this.resultMatrix);
    }
}