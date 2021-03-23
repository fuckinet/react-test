import { combineReducers } from 'redux';

import tasksReducer from './features/tasksSlice';

const rootReducer = combineReducers({
  tasks: tasksReducer
});

export default rootReducer
