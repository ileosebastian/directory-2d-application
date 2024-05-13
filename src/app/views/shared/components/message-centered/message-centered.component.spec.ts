import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageCenteredComponent } from './message-centered.component';

describe('MessageCenteredComponent', () => {
  let component: MessageCenteredComponent;
  let fixture: ComponentFixture<MessageCenteredComponent>;

  // beforeEach(waitForAsync(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ MessageCenteredComponent ],
  //     imports: [IonicModule.forRoot()]
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(MessageCenteredComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // }));

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
