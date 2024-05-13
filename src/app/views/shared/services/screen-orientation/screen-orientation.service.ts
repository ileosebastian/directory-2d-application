import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

import { Subscription } from 'rxjs';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

import { ElementLayout } from '../../models/element-layout.interface';


@Injectable({
  providedIn: 'root'
})
export class ScreenOrientationService {

  private screenOrientation = inject(ScreenOrientation);
  private rendererFactory = inject(RendererFactory2);

  private renderer!: Renderer2;

  private width!: string;
  private height!: string;

  private elements: ElementLayout[] = [];

  private suscriptor!: Subscription;

  currentOrientation!: string;

  private headerOb: ElementLayout = {
    id: 'header-map',
    isColumn: true,

    verticalSize: '12',
    horizontalSize: '8',
    verticalWidth: '100%',
    verticalHeight: '33%',
    horizontalWidth: '30%',
    horizontalHeight: '100%'
  };

  private contentOb: ElementLayout = {
    id: 'content-directory',
    isColumn: true,

    verticalSize: '12',
    horizontalSize: '4',
    verticalWidth: '100%',
    verticalHeight: '67%',
    horizontalWidth: '70%',
    horizontalHeight: '100%'
  };

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.elements = [this.headerOb, this.contentOb];
  }

  execute() {
    this.switchLayoutByOrientationType(this.screenOrientation.type, this.elements);
    this.currentOrientation = this.screenOrientation.type;
    this.suscriptor = this.screenOrientation.onChange()
      .subscribe(() => {
        this.switchLayoutByOrientationType(this.screenOrientation.type, this.elements);
        this.currentOrientation = this.screenOrientation.type;
      });
  }

  async lockOrientation(orientation: string) {
    this.screenOrientation.lock(orientation);
  }

  unlockOrientation() {
    this.screenOrientation.unlock();
  }

  switchLayoutByOrientationAndElement(
    orientation: string,
    elementId: string,
    verticalWidth: string,
    verticalHeight: string,
    horizontalWidth: string,
    horizontalHeight: string) {
    if (orientation.includes('portrait')) { // Vertical layout
      this.width = verticalWidth;
      this.height = verticalHeight;
    } else { // Horizontal layout
      this.width = horizontalWidth;
      this.height = horizontalHeight;
    }

    this.renderer.setStyle(document.getElementById(elementId), 'width', this.width);
    this.renderer.setStyle(document.getElementById(elementId), 'height', this.height);
  }

  unsuscribeChange() {
    this.suscriptor.unsubscribe();
  }

  private switchLayoutByOrientationType(orientation: string, elements: ElementLayout[]) {
    let headerMap = document.getElementById('header-map');
    elements.forEach(element => {
      if (orientation.includes('portrait')) { // Vertical layout
        this.width = element.isColumn ? element.verticalSize || '12' : element.verticalWidth;
        this.height = element.verticalHeight;

        if (headerMap) {
          this.renderer.addClass(headerMap, 'border-bottom');
          this.renderer.removeClass(headerMap, 'border-right');
        }

      } else { // Horizontal layout
        this.width = element.isColumn ? element.horizontalSize || '12' : element.horizontalWidth;
        this.height = element.horizontalHeight;

        if (headerMap) {
          this.renderer.removeClass(headerMap, 'border-bottom');
          this.renderer.addClass(headerMap, 'border-right');
        }
      }

      this.renderer.setAttribute(document.getElementById(element.id), 'size', this.width);
      this.renderer.setStyle(document.getElementById(element.id), 'width', this.width);
      this.renderer.setStyle(document.getElementById(element.id), 'height', this.height);
    });
  }
}
