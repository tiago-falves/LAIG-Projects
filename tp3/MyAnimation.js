class MyAnimation {
    /**
     * @constructor
     */
    constructor() {
        if (this.constructor === MyAnimation) {
            throw new TypeError('Abstract class "MyAnimation" cannot be instantiated directly.'); 
        }
    }
    update(time){
        throw new TypeError('Abstract method "update" from abstract class cannot be called directly'); 
    }
    apply(){
        throw new TypeError('Abstract method "apply" from abstract class cannot be called directly'); 
    }
}