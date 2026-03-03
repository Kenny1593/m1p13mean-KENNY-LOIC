import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userboutique } from './userboutique';

describe('Userboutique', () => {
  let component: Userboutique;
  let fixture: ComponentFixture<Userboutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userboutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userboutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
