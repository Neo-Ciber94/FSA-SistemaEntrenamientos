import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChoiceBuilderComponent } from './multi-choice-builder.component';

describe('MultiChoiceBuilderComponent', () => {
  let component: MultiChoiceBuilderComponent;
  let fixture: ComponentFixture<MultiChoiceBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiChoiceBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChoiceBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
