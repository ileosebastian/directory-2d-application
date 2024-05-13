import { Injectable } from '@angular/core';

import { AnimateTourUseCase } from '../application/animate-tour.usecase';

import { Blueprint } from '../domain/tour.domain';


@Injectable({
    providedIn: 'root'
})
export class TourController {

    // properties
    private canvas!: HTMLCanvasElement;

    // use cases
    private readonly animateTourUseCase: AnimateTourUseCase;

    constructor() {
        this.animateTourUseCase = new AnimateTourUseCase();
    }

    createStage(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    async executeAnimation(blueprints: Blueprint[]) {
        if (this.canvas) {
            await this.animateTourUseCase.run(blueprints, this.canvas);
        } else {
            throw new Error("Error generating animations, because doesn't have canvas context");
        }
    }

    stopTour() {
        if (this.canvas) {
            this.animateTourUseCase.endAnimation();
        } else {
            throw new Error("Error generating animations, because doesn't have canvas context");
        }
    }

}