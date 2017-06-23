import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexContentComponent } from './index-content.component';

describe('IndexContentComponent', () => {
  let component: IndexContentComponent;
  let fixture: ComponentFixture<IndexContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
