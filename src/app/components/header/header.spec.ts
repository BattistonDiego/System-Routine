import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { UserStateService } from '../../service/user-state.service';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { User } from '../../interface/user.model';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  let userStateService: jasmine.SpyObj<UserStateService>;

  beforeEach(async () => {
    userStateService = jasmine.createSpyObj('UserStateService', ['setUsuario', 'getUsuario']);

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter(routes),
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        { provide: UserStateService, useValue: userStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    userStateService.getUsuario.and.returnValue(of(null));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('deve setar o usuario quando getUsuario emitir', () => {
    const usuario: User = {
      id: 1,
      nome: 'Diego Battiston',
      email: 'diego@email.com',
      telefone: '11999999999',
      senha: '123456',
      perfil: 'ADMIN',
      status: 'ATIVO',
    };
    userStateService.getUsuario.and.returnValue(of(usuario));
    fixture.detectChanges();

    expect(component.usuario).toEqual(usuario);
  });
});
