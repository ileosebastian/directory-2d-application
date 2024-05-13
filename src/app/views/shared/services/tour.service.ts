import { Injectable, WritableSignal, signal } from '@angular/core';
import { UUID } from 'src/app/core/shared/models/core.types';


@Injectable({
  providedIn: 'root'
})
export class TourService {

  private isActiveTour: WritableSignal<boolean>;

  id!: UUID | string;
  color: string = 'secondary';

  constructor() {
    this.isActiveTour = signal<boolean>(false);
  }

  getIsActiveTour() {
    return this.isActiveTour;
  }

  setIsActiveTour(isActive: boolean,) {
    this.isActiveTour.set(isActive);
  }

  setTourParams(id: UUID | string, color: string) {
    this.id = id;
    this.color = color;
  }

}
