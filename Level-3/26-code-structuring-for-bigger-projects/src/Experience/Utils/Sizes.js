import EventEmitter from "./EventEmitter";


export default class Sizes extends EventEmitter {
    constructor(){
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2); // limit pixel ratio

        // on resize event
        window.addEventListener('resize', () =>{
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2); // limit pixel ratio
            this.trigger('resize');
        });
    }
}
