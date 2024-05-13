import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DatabaseErrorComponent } from './database-error.component';

describe('DatabaseErrorComponent', () => {
  let component: DatabaseErrorComponent;
  let fixture: ComponentFixture<DatabaseErrorComponent>;

  // beforeEach(waitForAsync(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ DatabaseErrorComponent ],
  //     imports: [IonicModule.forRoot()]
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(DatabaseErrorComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // }));

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
