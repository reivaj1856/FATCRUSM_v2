import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TallaslistComponent } from './tallaslist.component';

describe('TallaslistComponent', () => {
  let component: TallaslistComponent;
  let fixture: ComponentFixture<TallaslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TallaslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TallaslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
