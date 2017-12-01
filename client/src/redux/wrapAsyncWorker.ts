import { AsyncActionCreators, AnyAction } from 'typescript-fsa';
import { Dispatch } from 'react-redux';

export default function wrapAsyncWorker<P, R, E>(
  asyncAction: AsyncActionCreators<P, R, E>,
  worker: (params: P) => Promise<R>
) {
  return function wrappedWorker(dispatch: Dispatch<AnyAction>, params: P): Promise<R> {
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