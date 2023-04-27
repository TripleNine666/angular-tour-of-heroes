import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroChangeDialogComponent } from './hero-change-dialog.component';

describe('HeroChangeDialogComponent', () => {
  let component: HeroChangeDialogComponent;
  let fixture: ComponentFixture<HeroChangeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroChangeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
