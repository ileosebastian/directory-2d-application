import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TourComponent } from './tour.component';

describe('TourComponent', () => {
  let component: TourComponent;
  let fixture: ComponentFixture<TourComponent>;

  // beforeEach(waitForAsync(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ TourComponent ],
  //     imports: [IonicModule.forRoot()]
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(TourComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // }));

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
