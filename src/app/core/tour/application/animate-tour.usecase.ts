import { GenerateStageUseCase } from "./generate-stage.usecase";
import { AnimateLocationUseCase } from "./animate-location.usecase";

import { Box } from "../domain/box.domain";
import { Blueprint } from '../domain/tour.domain';
import { Waypoint } from "../domain/waypoint.domain";

import { FRAMES } from "../../shared/data/constants.data";


export class AnimateTourUseCase {

    // use cases
    private generateStageUseCase!: GenerateStageUseCase;
    private animateLocationUseCase!: AnimateLocationUseCase;

    // For rendering graphs
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    // To handle frames per second
    private fpsInterval!: number;
    private now!: number;
    private then!: number;
    private elapsed!: number;

    // To handle animations in realtime
    private animationHandler!: number;
    private timeoutHanlder !: any;

    // Portions and positions params
    private widthTiles!: number;
    private heightTiles!: number;
    // Animation params
    private index = 0;
    private center = 5;
    private color = '#3880FF';
    private lineWidth = 3;
    private middleRow!: number;

    // Blueprints params
    private blueprints!: Blueprint[];
    private currentBlueprint!: Blueprint;
    private indexBP!: number;
    private currentPath!: Box[];

    constructor() {
        this.generateStageUseCase = new GenerateStageUseCase();
        this.animateLocationUseCase = new AnimateLocationUseCase();
    }

    async run(blueprints: Blueprint[], canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = this.canvas.getContext('2d');
        if (context && blueprints.length > 0) {
            this.ctx = context;
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.lineWidth;
        } else {
            throw new Error("The respective blueprints and/or graphic context has not been provided to make the animations.")
        }
        this.endAnimation();

        this.indexBP = 0;
        this.blueprints = blueprints;
        this.currentBlueprint = this.blueprints[this.indexBP];
        this.currentPath = this.currentBlueprint.path;

        const plane = this.currentBlueprint.plane;
        this.middleRow = Math.floor( plane.rows/2 );
        this.widthTiles = plane.widthTiles;
        this.heightTiles = plane.heightTiles;

        await this.startAnimation();
    }

    private async startAnimation() {
        this.fpsInterval = 1000 / FRAMES;
        this.then = window.performance.now();

        this.generateStageUseCase.run(this.currentBlueprint.plane, this.canvas, this.currentBlueprint.start.contain as Waypoint);

        this.ctx.beginPath();
        this.animate(0);
    }

    private async animate(newTime: number) {
        this.animationHandler = requestAnimationFrame(this.animate.bind(this));

        this.now = newTime;
        this.elapsed = this.now - this.then;

        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);

            // use canvas context to draw...
            this.walkingThePathWithLines(this.currentPath);
        }
    }

    endAnimation() {
        cancelAnimationFrame(this.animationHandler);
        clearTimeout(this.timeoutHanlder);
        this.animateLocationUseCase.stopAnimateLocation();
        this.ctx.closePath();
        this.index = 0; // init path again
    }

    private async generateAnimationAgain() {
        this.currentBlueprint = this.blueprints[this.indexBP];
        this.currentPath = this.currentBlueprint.path;
        await this.startAnimation();
    }
    
    private async walkingThePathWithLines(path: Box[]) {
        if (this.index >= path.length - 1) {
            const x = path[path.length - 1].x * this.widthTiles;
            let y: number;
            // to show locate animation top or bottom with respect to goal
            if (path[path.length - 1].y <= this.middleRow) {
                y = path[path.length - 1].y * this.heightTiles - this.heightTiles;
            } else {
                y = path[path.length - 1].y * this.heightTiles + (this.heightTiles * 6);
            }

            this.endAnimation();

            if (this.indexBP >= this.blueprints.length - 1) {
                await this.animateLocationUseCase.run(x, y, this.ctx);
                this.timeoutHanlder = setTimeout(async () => {
                    this.indexBP = 0;
                    await this.generateAnimationAgain();
                }, 1000);
            } else {
                this.indexBP++;
                await this.generateAnimationAgain();
            }
        } else {
            this.index++;
        }

        if ((this.index + 1) !== path.length - 1 && path[this.index - 1] && path[this.index + 1] && this.correctTrajectory(path[this.index - 1], path[this.index + 1])) {
            this.drawLine(path[this.index - 1], path[this.index + 1], this.center, this.color, this.lineWidth);
            this.index++;
        } else {
            this.drawLine(path[this.index - 1], path[this.index], this.center, this.color, this.lineWidth);
        }
    }
    
    private drawLine(previous: Box, next: Box, center: number, color: string, lineWidth: number) {
        this.ctx.moveTo(previous?.x * this.widthTiles + center, previous?.y * this.heightTiles + center);
        this.ctx.lineTo(next.x * this.widthTiles + center, next.y * this.heightTiles + center);
        this.ctx.stroke();
    }

    private correctTrajectory(prevPath: Box, nextPath: Box): boolean {
        // Right upper corner
        if (prevPath.x + 1 === nextPath.x && prevPath.y - 1 === nextPath.y) {
            return true;
        }

        // Lower right corner
        if (prevPath.x + 1 === nextPath.x && prevPath.y + 1 === nextPath.y) {
            return true;
        }

        // Bottom left corner 
        if (prevPath.x - 1 === nextPath.x && prevPath.y + 1 === nextPath.y) {
            return true;
        }

        // Upper left corner 
        if (prevPath.x - 1 === nextPath.x && prevPath.y - 1 === nextPath.y) {
            return true;
        }

        return false; // No need to correct trajectory
    }

}