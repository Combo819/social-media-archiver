import { combineReducers } from 'redux';
import { account } from './account';
import { routeState } from './routeState';
const rootReducer = combineReducers({ routeState, account });
export type RootState = ReturnType<typeof rootReducer>;
export { rootReducer };
