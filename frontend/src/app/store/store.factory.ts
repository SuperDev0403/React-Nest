import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from '../module/_root/root.reducer';
import { rootSaga } from '../module/_root/root.saga';
import { createWsMiddleware } from '../module/ws/ws.middleware';

export class StoreFactory {

	static createStore(): Store {
		const composeEnhancers = StoreFactory.createComposeEnhancers();
		const sagaMiddleware = createSagaMiddleware();
		const wsMiddleware = createWsMiddleware();

		const store = createStore(
			rootReducer,
			composeEnhancers(
				applyMiddleware(
					// logger,
					wsMiddleware,
					sagaMiddleware,
				),
			),
		);

		sagaMiddleware.run(rootSaga);

		return store;
	}

	private static createComposeEnhancers() {
		return composeWithDevTools({});
	}
}
