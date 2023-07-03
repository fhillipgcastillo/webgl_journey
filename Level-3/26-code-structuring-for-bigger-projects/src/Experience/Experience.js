import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
export default class Experience {
    constructor(canvas) {
        // GLoball Acess
        window.experience = this;

        // options
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.time = new Time();

        // events
        this.sizes.on('resize', () => {
            this.resize();
        });
        this.time.on('tick', () => {
            this.update();
        })
        console.log('Experience');
    }
    resize() {
        
    }
    update(){

    }
}
