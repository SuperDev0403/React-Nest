import React, { FunctionComponent, useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { getError, hasError } from '../../../../lib/final-form/field.meta';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { authLogin, AuthLoginRequest } from '../../../../api/sdk/auth/auth.login';
import { FORM_ERROR } from 'final-form';
import { useDispatch } from 'react-redux';
import { authorizationResult } from '../../../module/auth/auth.action';
import { AUTH_REGISTER, AUTH_RESET_PASSWORD } from '../../../routing/route';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { createStyles, Link, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme: Theme) => createStyles({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	form: {
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bottom: {
		padding: 20,
	},
}));

export const LoginScreen: FunctionComponent = () => {
	const dispatch = useDispatch();

	const onSubmit = useCallback(async (values: AuthLoginRequest) => {
		let response;

		try {
			response = await authLogin(values);
		} catch (e) {
			console.error(e);
			return {[FORM_ERROR]: 'Unknown error occurred'};
		}

		if (!response.user) {
			return {[FORM_ERROR]: 'Username or password invalid'};
		}

		dispatch(authorizationResult(response.user));
	}, [dispatch]);

	const classes = useStyle();

	return (
		<Container
			component="main"
			maxWidth="xs"
			className={classes.container}
		>
			<div className={classes.form}>
				<div style={{textAlign: 'center', padding: '20px 0'}}>
					<img style={{height: '180px', borderRadius: '15px'}} src={require('../../../asset/image/heli.jpg')}/>
				</div>

				<Form onSubmit={onSubmit}>
					{(props) => (
						<form onSubmit={props.handleSubmit}>
							{!!props.error && (
								<Alert severity="warning">{props.error}</Alert>
							)}
							{!!props.submitError && (
								<Alert severity="error">{props.submitError}</Alert>
							)}

							<Field name="email">
								{(props) => (
									<TextField
										{...props.input}
										type="email"
										label="Email"
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										variant="outlined"
										margin="normal"
										fullWidth
									/>
								)}
							</Field>

							<Field name="password">
								{(props) => (
									<TextField
										{...props.input}
										type="password"
										label="Password"
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										variant="outlined"
										margin="normal"
										fullWidth
									/>
								)}
							</Field>

							<div style={{textAlign: 'center'}}>
								<Button
									type="submit"
									color="primary"
									variant="contained"
									fullWidth={true}
									disabled={props.submitting}
									style={{margin: '20px 0', fontSize: '1rem'}}
								>
									Log In
								</Button>

								<Link
									component={RouterLink}
									to={AUTH_RESET_PASSWORD}
								>
									Forgot your password?
								</Link>
							</div>
						</form>
					)}
				</Form>
			</div>

			<Typography
				color="primary"
				component="div"
				className={classes.bottom}
			>
				<Link
					component={RouterLink}
					to={AUTH_REGISTER}
				>
					Don't Have An Account Yet?&nbsp;
					<span style={{fontWeight: 'bolder'}}>Register</span>
				</Link>
			</Typography>
		</Container>
	);

};
