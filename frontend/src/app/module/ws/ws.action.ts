import { createAction } from '@reduxjs/toolkit';

export const connectRequest = createAction('ws/connect_request');
export const connectResult = createAction('ws/connect_result', (error?: Error) => {
	return {payload: error, error: !!error};
});

export const closeRequest = createAction('ws/close_request');
export const closeResult = createAction('ws/close_result');

export const emitRequest = createAction('ws/emit_request', (event: string, data: any) => {
	return {payload: {event, data}};
});

export const subscribeRequest = createAction('ws/subscribe_request', (event: string) => {
	return {payload: event};
});

export const event = createAction('ws/event', (event: string, data: any) => {
	return {payload: {event, data}};
});
