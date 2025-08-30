import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustStatsComponent } from './trust-stats.component';

describe('TrustStatsComponent', () => {
  let component: TrustStatsComponent;
  let fixture: ComponentFixture<TrustStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrustStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
