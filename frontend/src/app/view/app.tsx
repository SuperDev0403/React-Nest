import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getBootstrapError, hasBootstrapped } from '../module/app/app.selector';
import { bootstrapRequest } from '../module/app/app.action';
import { LoginScreen } from './screen/auth/login.screen';
import { AUTH_LOGIN, AUTH_REGISTER, AUTH_RESET_PASSWORD, AUTH_UPDATE_PASSWORD, INDEX } from '../routing/route';
import { RegistrationScreen } from './screen/auth/registration.screen';
import { RootState } from '../module/_root/root.state';
import { isUserLoggedInSelector } from '../module/auth/auth.selector';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MainScreen } from './screen/main/main.screen';
import { ResetPasswordScreen } from './screen/auth/reset.password.screen';
import { UpdatePasswordScreen } from './screen/auth/update.password.screen';
import { Grid } from '@material-ui/core';
import { NavBar } from './component/nav-bar/nav.bar';

interface AppProps {
	bootstrapRequest: typeof bootstrapRequest;
	hasBootstrapped?: boolean;
	bootstrapError?: Error;
	isLoggedIn: boolean;
	baseUrl?: string;
}

const AppComponent: FunctionComponent<AppProps> = (props) => {
	const {hasBootstrapped, baseUrl, bootstrapError, bootstrapRequest, isLoggedIn} = props;

	useEffect(() => {
		bootstrapRequest();

	}, [bootstrapRequest]);

	if (!!bootstrapError) {
		return (
			<div>An error occurred while initializing application</div>
		);
	}

	if (!hasBootstrapped) {
		return null;
	}

	return (
		<BrowserRouter basename={baseUrl}>
			<CssBaseline/>
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="stretch"
				spacing={0}
				style={{
					height: window.innerHeight,
					width: '100%',
				}}
			>
				{isLoggedIn && (

					<Switch>
						<Redirect to={INDEX} from={'/auth'}/>
						<Route path={INDEX} component={MainScreen}/>
					</Switch>
				)}

				{!isLoggedIn && (
					<>
						<Grid item style={{flex: 'none'}}>
							<NavBar/>
						</Grid>

						<Grid
							container
							item
							style={{flexGrow: 1, height: 0}}
							direction="column"
							justify="flex-start"
							alignItems="stretch"
							spacing={0}
						>
							<Switch>
								<Route exact={true} path={AUTH_LOGIN} component={LoginScreen}/>
								<Route exact={true} path={AUTH_REGISTER} component={RegistrationScreen}/>
								<Route exact={true} path={AUTH_RESET_PASSWORD} component={ResetPasswordScreen}/>
								<Route exact={true} path={AUTH_UPDATE_PASSWORD} component={UpdatePasswordScreen}/>
								<Redirect from="*" to={AUTH_LOGIN}/>
							</Switch>
						</Grid>
					</>
				)}
			</Grid>

		</BrowserRouter>
	);
};

export const App = connect(
	(state: RootState) => ({
		hasBootstrapped: hasBootstrapped(state),
		bootstrapError: getBootstrapError(state),
		isLoggedIn: isUserLoggedInSelector(state),
	})
	,
	{
		bootstrapRequest,
	},
)(AppComponent);
