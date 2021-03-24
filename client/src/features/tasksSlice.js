import { toast } from 'react-toastify';

import Api from '../api';

const initialState = {
  tasks: [],
  page: 1,
  total_task_count: 0
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case 'tasks/loaded': {
      return action.payload
    }
    case 'tasks/added': {
      return {...state, tasks: [...state.tasks, action.payload]}
    }
    case 'tasks/updated': {
      for (let i = 0; i < state.tasks.length; i += 1) {
        const task = state.tasks[i];
        if (task.id === action.payload.id) {
          task[action.payload.field] = action.payload.newValue;
        }
      }
      return {...state};
    }
    default:
      return state
  }
}

export function fetchTasks(page, sort, sortDirection) {
  return async function fetchTasksThunk(dispatch) {
    const { data } = await Api.get('/tasks', {
      page, sort, sortDirection
    });
    dispatch({ type: 'tasks/loaded', payload: data })
  }
}

export function updateTask(id, field, newValue) {
  return async function fetchTasksThunk(dispatch, getState) {
    try {
      const { auth: { token } } = getState();
      const { data } = await Api.put(`/tasks/${id}`, {
        field, newValue
      }, {
        Authorization: `Bearer ${token}`
      });
      if (data.error) {
        return toast(data.error.message);
      }
      toast('Изменения сохранены!');
      dispatch({ type: 'tasks/updated', payload: data })
    }
    catch (e) {
      if (e.response && e.response.status === '401') {
        toast('Ошибка авторизации!');
      }
      else {
        toast('Произошла ошибка редактировании!');
      }
    }
  }
}


export function createTask(name, email, text) {
  return async function createTaskThunk(dispatch) {
    const initialTask = { name, email, text };
    const { data } = await Api.post('/tasks', initialTask);
    if (data.error) {
      return toast(data.error.message);
    }
    toast('Задача добавлена!');
    dispatch({ type: 'tasks/added', payload: data })
  }
}
