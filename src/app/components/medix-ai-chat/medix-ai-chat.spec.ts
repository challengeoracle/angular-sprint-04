import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedixAiChat } from './medix-ai-chat';

describe('MedixAiChat', () => {
  let component: MedixAiChat;
  let fixture: ComponentFixture<MedixAiChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedixAiChat],
    }).compileComponents();

    fixture = TestBed.createComponent(MedixAiChat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
