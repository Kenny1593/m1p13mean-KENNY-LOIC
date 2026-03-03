import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navboutique } from './navboutique';

describe('Navboutique', () => {
  let component: Navboutique;
  let fixture: ComponentFixture<Navboutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navboutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navboutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
