import _ from 'lodash';
import { IUser } from '../../types';
import { ACCOUNT } from '../actionTypes';

const initState: IUser | null = null;

function account(
  state = initState,
  action: { type: string; payload: IUser | null },
) {
  const { type, payload } = action;
  switch (type) {
    case ACCOUNT.SET_ACCOUNT: {
      return _.cloneDeep(payload);
    }
    default: {
      return state;
    }
  }
}

export { account };
