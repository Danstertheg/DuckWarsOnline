class Animator{
    constructor(x,y,frames,assetPath,delay){
        // current x position of the object to animate
        this.x = x;
        // current y position of the object to animate
        this.y = y;
        // the number of frames the animation has 
        this.frames = frames;
        // the path to the folder of the asset 
        this.assetPath = assetPath;
        // the number of game ticks before frame change.
        this.delay = delay;
    }
    update(){

    }
}