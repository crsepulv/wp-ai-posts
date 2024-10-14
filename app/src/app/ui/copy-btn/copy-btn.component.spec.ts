import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBtnComponent } from './copy-btn.component';

describe('CopyBtnComponent', () => {
  let component: CopyBtnComponent;
  let fixture: ComponentFixture<CopyBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CopyBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
