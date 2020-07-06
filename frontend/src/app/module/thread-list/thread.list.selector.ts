import { createSelector } from 'reselect';
import { WithThreadListState } from './thread.list.state';
import { getState as getEntityState } from '../entity/entity.selector';
import { getThreadEntityByUserId } from '../thread/thread.selector';

export const getState = (state: WithThreadListState) => state.threadList;

export const getThreadListSelector = createSelector(
	[getState, getEntityState],
	(threadListState, entityState) => {
		if (!threadListState.itemList) {
			return;
		}

		const threadList = threadListState.itemList.map(
			threadId => getThreadEntityByUserId(entityState, threadId)!,
		).filter(
			thread => typeof thread !== 'undefined',
		);

		threadList
			.sort((a, b) => {
				if (!!a.lastMessage && !!b.lastMessage) {
					return a.lastMessage.createdAt > b.lastMessage.createdAt ? 1 :
						(a.lastMessage.createdAt < b.lastMessage.createdAt ? -1 : 0);
				} else if (!!a.lastMessage && !b.lastMessage) {
					return 1;
				} else if (!a.lastMessage && !!b.lastMessage) {
					return -1;
				} else {
					return 0;
				}
			})
			.reverse();

		return threadList.map(t => t.user.id);
	},
);

export const createGetThreadByUserIdSelector = () => {
	return createSelector(
		getEntityState,
		(_: any, id?: string) => id,
		getThreadEntityByUserId,
	);
};

export const getTotalNewMessageCount = createSelector(
	getThreadListSelector,
	getEntityState,
	(threadList, entityState) => {
		return threadList?.reduce((carry: number, threadId: string) => {
			const thread = getThreadEntityByUserId(entityState, threadId);
			return carry + (thread?.newMessageCount || 0);
		}, 0);
	},
);
