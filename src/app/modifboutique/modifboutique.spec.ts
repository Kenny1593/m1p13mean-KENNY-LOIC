import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modifboutique } from './modifboutique';

describe('Modifboutique', () => {
  let component: Modifboutique;
  let fixture: ComponentFixture<Modifboutique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modifboutique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modifboutique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
