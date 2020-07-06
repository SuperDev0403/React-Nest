import { combineReducers } from 'redux';
import { appReducer } from '../app/app.reducer';
import { logoutResult } from '../auth/auth.action';
import { authReducer } from '../auth/auth.reducer';
import { callListReducer } from '../call-list/call.list.reducer';
import { contactListReducer } from '../contact-list/contact.list.reducer';
import { entityReducer } from '../entity/entity.reducer';
import { loaderReducer } from '../loader/loader.reducer';
import { messageListReducer } from '../message-list/message.list.reducer';
import { threadListReducer } from '../thread-list/thread.list.reducer';
import { userReducer } from '../user/user.reducer';
import { RootState } from './root.state';
import { wsReducer } from '../ws/ws.reducer';

const combinedReducers = combineReducers<RootState>({
	auth: authReducer,
	app: appReducer,
	loader: loaderReducer,
	entity: entityReducer,
	contactList: contactListReducer,
	threadList: threadListReducer,
	messageList: messageListReducer,
	user: userReducer,
	callList: callListReducer,
	ws: wsReducer,
});

export const rootReducer = (state: any, action: any) => {
	// reset state on logout
	if (logoutResult.match(action)) {
		// keep certain parts of the state
		state = {
			app: state.app,
			auth: state.auth,
		};
	}

	state = combinedReducers(state, action);

	return state;
};
