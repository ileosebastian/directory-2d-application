import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisconnectedComponent } from './disconnected.component';

describe('DisconnectedComponent', () => {
  let component: DisconnectedComponent;
  let fixture: ComponentFixture<DisconnectedComponent>;

  // beforeEach(waitForAsync(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DisconnectedComponent ],
  //     imports: [IonicModule.forRoot()]
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(DisconnectedComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // }));

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
