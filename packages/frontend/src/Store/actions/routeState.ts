import { ROUTE_STATE } from '../actionTypes';
import { HomeState, PostContentState } from '../reducers/routeState';

const routeStateCreators = {
  setHomeRoute: (payload: HomeState) => {
    return { type: ROUTE_STATE.HOME.SET_HOME, payload };
  },
  setPostContentState: (payload: PostContentState) => {
    return { type: ROUTE_STATE.POST_CONTENT.SET_POST_CONTENT, payload };
  },
};

export { routeStateCreators };
