import Sizes from "./Utils/Sizes";

export default class Experience {
    constructor(canvas) {
        // GLoball Acess
        window.experience = this;

        // options
        this.canvas = canvas;
        this.sizes = new Sizes();
        this.sizes.on('resize', () => {
            this.resize();
        });
        console.log('Experience');
    }
    resize() {
        
    }
}
