import { IUser } from '../../types';
import { ACCOUNT } from '../actionTypes';

const accountCreators = {
  setAccount: (payload: IUser | null) => ({
    type: ACCOUNT.SET_ACCOUNT,
    payload,
  }),
};

export { accountCreators };
