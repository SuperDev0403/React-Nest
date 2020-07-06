import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from '../serviceWorker';
import { StoreFactory } from './store/store.factory';
import { App } from './view/app';

import './asset/stlye/index.css';
import './module/media-device/media.devices.polyfill';

// create redux store
const store = StoreFactory.createStore();

// customize material UI theme
const theme = createMuiTheme({
	palette: {
		grey: {},
		primary: {
			main: '#063B9E',
		},
		secondary: {
			main: '#E16C6C',
		},
		background: {
			default: '#fff',
			paper: '#fff',
		},
	},
	overrides: {
		MuiInputLabel: {
			outlined: {
				color: '#063B9E',
				fontWeight: 'lighter',
			},
		},
		MuiOutlinedInput: {
			root: {
				'&:hover .MuiOutlinedInput-notchedOutline': {
					borderColor: '#063B9E',
				},
			},
			input: {
				color: '#063B9E',
				fontWeight: 'lighter',
			},
			notchedOutline: {
				borderColor: '#A5C0F2',
				borderRadius: '13px',
			},
		},
		MuiButton: {
			root: {
				paddingTop: '10px',
				paddingBottom: '10px',
				borderRadius: '29px',
				fontSize: '15px',
			},
			contained: {
				borderRadius: '29px',
			},
			label: {
				textTransform: 'none',
			},
		},
		MuiAvatar: {
			root: {
				width: '46px',
				height: '46px',
			},
			colorDefault: {
				color: '#6F9BED',
				backgroundColor: '#E5EAF2',
			},
		},
		MuiListItemText: {
			primary: {
				fontSize: '15px',
				fontWeight: 500,
				color: '#000',
			},
			secondary: {
				fontSize: '15px',
				fontWeight: 'lighter',
				color: '#000',
			},
		},
		MuiAppBar: {
			colorDefault: {
				backgroundColor: '#fff',
				borderBottom: '1px solid #E5EAF2',
			},
		},
	},
});
theme.overrides!.MuiToolbar = {
	root: {
		[theme.breakpoints.up('md')]: {
			height: 100,
		},
	},
};

/*
 * Run the App
 */
ReactDOM.render(
	(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<App/>
			</ThemeProvider>
		</Provider>
	),
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
