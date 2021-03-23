import { combineReducers } from 'redux';

import tasksReducer from './features/tasksSlice';
import authReducer from './features/loginSlice';

const rootReducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer
});

export default rootReducer
