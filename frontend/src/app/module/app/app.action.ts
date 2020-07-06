import { createAction } from '@reduxjs/toolkit';

export const bootstrapRequest = createAction('app/bootstrap_request');
export const bootstrapResult = createAction('app/bootstrap_result', (error?: Error) => {
	return {payload: error, error: !!error};
});
