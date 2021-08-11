import { computed, inject, reactive, toRefs, watch } from 'vue';
import { useApi, useApiWithAuth } from './api';

const AUTH_KEY = 'sessionToken';
export const AUTH_TOKEN = 'accessToken';

interface User {
  id: string;
  email: string;
  username: Date;
  [AUTH_TOKEN]: string;
}
interface LoginResponse {
  accessToken: string;
}

interface AuthState {
  authenticating: boolean;
  user?: User;
  error?: Error;
}

const state = reactive<AuthState>({
  authenticating: false,
  user: undefined,
  error: undefined,
});

// Read access token from local storage?
const token = window.localStorage.getItem(AUTH_KEY);

if (token) {
  const { loading, error, data, get } = useApi('/auth/user');
  state.authenticating = true;

  get({}, { headers: { Authorization: `Bearer ${token}` } });

  watch([loading], () => {
    if (error.value) {
      window.localStorage.removeItem(AUTH_KEY);
    } else if (data.value) {
      state.user = data.value.user;
    }

    state.authenticating = false;
  });
}

export const useAuth = () => {
  const setUser = (payload: LoginResponse, remember: boolean): void => {
    const token = payload.accessToken;
    if (remember) {
      window.localStorage.setItem(AUTH_KEY, token);
    }
    const { loading, error, data, get } = useApi('/auth/user', token);
    get();
    watch([loading], () => {
      if (error.value) {
        state.error = error.value;
        return;
      }
      state.user = data.value.user;
      state.error = undefined;
    });
  };

  const logout = (): Promise<void> => {
    window.localStorage.removeItem(AUTH_KEY);
    return Promise.resolve((state.user = undefined));
  };

  return {
    setUser,
    logout,
    ...toRefs(state),
  };
};
