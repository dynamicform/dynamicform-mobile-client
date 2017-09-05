import { applyMiddleware, createStore,combineReducers,compose} from 'redux';
import formReducer from '../../src/reducers/formReducer';
import thunk from 'redux-thunk';
const middleware = applyMiddleware(thunk);

export default createStore(
    combineReducers({
        formReducer:formReducer
    }),
    middleware
);