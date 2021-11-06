import { ROUTE_STATE } from '../actionTypes';
import _ from 'lodash';

type HomeState = {
  queryString: string;
  id: string;
};

type PostContentState = {
  queryString: string;
  id: string;
};

type RouteState = {
  home: HomeState;
  postContent: PostContentState;
};

const initState: RouteState = {
  home: {
    queryString: '',
    id: '',
  },
  postContent: {
    queryString: '',
    id: '',
  },
};

function routeState(
  state = initState,
  action: { type: string; payload: HomeState | PostContentState },
): RouteState {
  const { type, payload } = action;
  switch (type) {
    case ROUTE_STATE.HOME.SET_HOME: {
      const newState = _.cloneDeep(state);
      newState['home'] = _.cloneDeep(payload) as HomeState;
      return newState;
    }
    case ROUTE_STATE.POST_CONTENT.SET_POST_CONTENT: {
      const newState = _.cloneDeep(state);
      newState['postContent'] = _.cloneDeep(payload) as PostContentState;
      return newState;
    }
    default: {
      return state;
    }
  }
}

export { routeState };

export type { RouteState, HomeState, PostContentState };
