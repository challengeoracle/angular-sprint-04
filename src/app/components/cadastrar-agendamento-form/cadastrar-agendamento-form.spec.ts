import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarAgendamentoForm } from './cadastrar-agendamento-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CadastrarAgendamentoForm', () => {
  let component: CadastrarAgendamentoForm;
  let fixture: ComponentFixture<CadastrarAgendamentoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarAgendamentoForm, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarAgendamentoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
