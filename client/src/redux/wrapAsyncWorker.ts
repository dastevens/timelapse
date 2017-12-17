import { AsyncActionCreators, AnyAction } from 'typescript-fsa';
import { Dispatch } from 'react-redux';

export default function wrapAsyncWorker<Params, Returns, Error>(
  asyncAction: AsyncActionCreators<Params, Returns, Error>,
  worker: (params: Params) => Promise<Returns>
) {
  return function wrappedWorker(dispatch: Dispatch<AnyAction>, params: Params): Promise<Returns> {
    dispatch(asyncAction.started(params));
    return worker(params).then(
      result => {
        dispatch(asyncAction.done({params, result}));
        return result;
      },                          
      error => {
        dispatch(asyncAction.failed({params, error}));
        throw error;
      });
  };
}