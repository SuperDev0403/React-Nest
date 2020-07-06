import { WithAppState } from '../app/app.state';
import { WithAuthState } from '../auth/auth.state';
import { WithCallListState } from '../call-list/call.list.state';
import { WithContactListState } from '../contact-list/contact.list.state';
import { WithEntityState } from '../entity/entity.state';
import { WithLoaderState } from '../loader/loader.state';
import { WithMessageListState } from '../message-list/message.list.state';
import { WithThreadListState } from '../thread-list/thread.list.state';
import { WithUserState } from '../user/user.state';
import { WithWsState } from '../ws/ws.state';

export interface RootState
	extends WithAppState,
		WithAuthState,
		WithLoaderState,
		WithEntityState,
		WithContactListState,
		WithThreadListState,
		WithMessageListState,
		WithUserState,
		WithCallListState,
		WithWsState {
}
