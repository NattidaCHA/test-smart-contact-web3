import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartcontactComponent } from './smartcontact.component';

describe('SmartcontactComponent', () => {
  let component: SmartcontactComponent;
  let fixture: ComponentFixture<SmartcontactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartcontactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
