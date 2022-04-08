import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnginePageComponent } from './engine-page.component';

describe('EnginePageComponent', () => {
  let component: EnginePageComponent;
  let fixture: ComponentFixture<EnginePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnginePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnginePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
