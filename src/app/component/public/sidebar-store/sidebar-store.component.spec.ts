import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStoreComponent } from './sidebar-store.component';

describe('SidebarStoreComponent', () => {
  let component: SidebarStoreComponent;
  let fixture: ComponentFixture<SidebarStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
