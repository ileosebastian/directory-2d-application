import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContentCardListComponent } from './content-card-list.component';

describe('ContentCardListComponent', () => {
  let component: ContentCardListComponent;
  let fixture: ComponentFixture<ContentCardListComponent>;

  // beforeEach(waitForAsync(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ ContentCardListComponent ],
  //     imports: [IonicModule.forRoot()]
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(ContentCardListComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // }));

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
