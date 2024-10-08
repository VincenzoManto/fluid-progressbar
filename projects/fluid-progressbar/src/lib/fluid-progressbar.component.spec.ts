import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidProgressbarComponent } from './fluid-progressbar.component';

describe('FluidProgressbarComponent', () => {
  let component: FluidProgressbarComponent;
  let fixture: ComponentFixture<FluidProgressbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FluidProgressbarComponent]
    });
    fixture = TestBed.createComponent(FluidProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
