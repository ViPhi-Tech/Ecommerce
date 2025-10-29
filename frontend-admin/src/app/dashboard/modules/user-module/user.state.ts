import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from 'app/shared/interfaces/api-response.interface';
import { BaseState } from 'app/shared/store/base.state';
import { catchError, finalize, lastValueFrom } from 'rxjs';
import { environments } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { UserModuleState } from 'app/shared/interfaces/user/UserModuleState';
import { IUser } from 'app/shared/interfaces/user/User';

@Injectable({
  providedIn: 'root',
})
export class UserState extends BaseState<UserModuleState> {
  private http = inject(HttpClient);
  private apiUrl = environments.apiUrl;

  protected state = signal<UserModuleState>({
    userList: [],
    view:
      (localStorage.getItem('userView') as UserModuleState['view']) || 'table',
    loading: false,
    error: null,
    searchTerm: '',
  });

  userList = computed(() => this.state().userList);
  currentView = computed(() => this.state().view);
  currentSearchTerm = computed(() => this.state().searchTerm);

  // Computed para filtrar usuários baseado no termo de busca
  filteredUserList = computed(() => {
    const state = this.state();
    const searchTerm = state.searchTerm;
    const userList = state.userList;

    let filteredUsers = [...userList];

    if (searchTerm.trim()) {
      filteredUsers = filteredUsers.filter(
        user =>
          user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filteredUsers;
  });

  async getUserList(): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.setUserList([]);

    await lastValueFrom(
      this.http
        .get<ApiResponse<IUser[]>>(`${this.apiUrl}user`, {
          headers: { 'Skip-Loader': 'true' },
        })
        .pipe(
          catchError(error => this.handleError(error)),
          finalize(() => this.setLoading(false))
        )
    )
      .then((response: any) => {
        const users = Array.isArray(response)
          ? response
          : response.dados || response.data;
        if (users && users.length > 0) {
          this.setUserList(users);
        } else {
          this.setUserList([]);
          this.setError('Nenhum usuário encontrado.');
        }
      })
      .catch(error => {
        this.setError('Erro ao carregar a lista de usuários');
        console.error('Erro ao buscar usuários:', error);
      });
  }

  setUserList(userList: IUser[]) {
    this.updateState('userList', userList);
  }

  setView(view: UserModuleState['view']) {
    this.updateState('view', view);
    localStorage.setItem('userView', view);
  }

  setSearchTerm(searchTerm: string) {
    this.updateState('searchTerm', searchTerm);
  }

  constructor() {
    super();
  }
}
