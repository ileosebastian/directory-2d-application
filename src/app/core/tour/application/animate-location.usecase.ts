import { FRAMES, sourceByCategory } from "../../shared/data/constants.data";


export class AnimateLocationUseCase {

    private intervalHanlder!: any;

    constructor() { }

    async run(x: number, y: number, context: CanvasRenderingContext2D) {
        const positionX = x - 10;
        const positionY = y - 13;

        let xGrowth = 0;
        let yGrowth = 0;

        const imageFloor = new Image();
        const imageLocation = new Image();
        context.beginPath();
        this.intervalHanlder = setInterval(() => {
            if (xGrowth > 10) return;

            // Floor base
            imageFloor.onload = () => {
                context.drawImage(
                    imageFloor,
                    positionX - (xGrowth > 0 ? (xGrowth / 2) : 0),
                    positionY,
                    (imageFloor.width + 10) + xGrowth,
                    (imageFloor.height + 5) + yGrowth
                );
            };

            imageFloor.src = sourceByCategory['floor-location'];

            // Floor Location 
            imageLocation.onload = () => {
                context.drawImage(
                    imageLocation,
                    positionX + 7 - (xGrowth > 0 ? (xGrowth / 2) : 0),
                    positionY - 26,
                    (imageLocation.width) + xGrowth,
                    (imageLocation.height + 9) + yGrowth
                );
            };

            imageLocation.src = sourceByCategory['destiny-location'];

            xGrowth = xGrowth + 1;
            yGrowth = yGrowth + 0.35;
        }, 500 / FRAMES);
        context.closePath();
    }

    async stopAnimateLocation() {
        clearInterval(this.intervalHanlder);
    }

}