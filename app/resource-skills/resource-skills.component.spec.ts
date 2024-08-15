import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceSkillsComponent } from './resource-skills.component';

describe('ResourceSkillsComponent', () => {
  let component: ResourceSkillsComponent;
  let fixture: ComponentFixture<ResourceSkillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceSkillsComponent]
    });
    fixture = TestBed.createComponent(ResourceSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
