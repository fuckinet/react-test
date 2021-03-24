import { toast } from "react-toastify";

import Api from '../api';

const initialState = {
  id: localStorage.getItem('auth_id'),
  token: localStorage.getItem('auth_token')
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'auth/success': {
      return action.payload
    }
    case 'auth/logout': {
      return {
        id: 0,
        token: null
      }
    }
    default:
      return state
  }
}

export function auth(login, password) {
  return async function authThunk(dispatch) {
    const { data } = await Api.post('/auth', {
      login, password
    });
    if (data.error) {
      return toast(data.error.message);
    }
    toast('Авторизация успешна!');
    localStorage.setItem('auth_id', data.id);
    localStorage.setItem('auth_token', data.token);
    dispatch({ type: 'auth/success', payload: data })
  }
}

export async function logout(dispatch, getState) {
  const { auth: { token } } = getState();
  await Api.post('/logout', {}, {
    Authorization: `Bearer ${token}`
  });
  toast('Вы успешно вышли из аккаунта!');
  localStorage.removeItem('auth_id');
  localStorage.removeItem('auth_token');
  dispatch({ type: 'auth/logout' })
}
