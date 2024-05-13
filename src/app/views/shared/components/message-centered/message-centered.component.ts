import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-message-centered',
  templateUrl: './message-centered.component.html',
  styleUrls: ['./message-centered.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageCenteredComponent  implements OnInit {

  @Input() message: string = '';

  ngOnInit() {}

}
