import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MessageCenteredComponent } from '../../../shared/components/message-centered/message-centered.component';
import { IonSkeletonText } from '@ionic/angular/standalone';


@Component({
  selector: 'app-load-tour',
  templateUrl: './load-tour.component.html',
  styleUrls: ['./load-tour.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    NgIf,
    MessageCenteredComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadTourComponent {

  @Input() showMapError: boolean = false;

}
