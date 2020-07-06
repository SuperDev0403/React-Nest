import { Action } from '@reduxjs/toolkit';
import { INITIAL_STATE, LoaderState } from './loader.state';

const requestTypeRegExp = /_request$/;
const resultTypeRegExp = /_result$/;

export const loaderReducer = (state: LoaderState = INITIAL_STATE, action: Action) => {
	const isRequest = requestTypeRegExp.test(action.type);
	const isResult = resultTypeRegExp.test(action.type);

	if (!isRequest && !isResult) {
		return state;
	}

	const loadingKey = action.type.replace(
		new RegExp(requestTypeRegExp.source + '|' + resultTypeRegExp.source),
		'',
	);

	if (isRequest && !state[loadingKey]) {
		return {
			...state,
			[loadingKey]: true,
		};
	}

	if (isResult && !!state[loadingKey]) {
		state = {...state};
		delete state[loadingKey];
		return state;
	}

	return state;
};
