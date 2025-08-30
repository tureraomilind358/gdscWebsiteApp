import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutePortalComponent } from './institute-portal.component';

describe('InstitutePortalComponent', () => {
  let component: InstitutePortalComponent;
  let fixture: ComponentFixture<InstitutePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutePortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstitutePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
