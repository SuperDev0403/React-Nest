import React, { FunctionComponent, useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { getError, hasError } from '../../../../lib/final-form/field.meta';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import { AUTH_LOGIN } from '../../../routing/route';
import { FORM_ERROR } from 'final-form';
import { authResetPassword, AuthResetPasswordRequest } from '../../../../api/sdk/auth/auth.reset.password';
import { createFromValidationResult } from '../../../../lib/final-form/submission.error';
import { ValidationResult } from '../../../../lib/validator/validation.result';
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
		width: '100%',
	},
	bottom: {
		padding: 20,
	},
}));

export const ResetPasswordScreen: FunctionComponent = () => {

	const onSubmit = useCallback(async (values: AuthResetPasswordRequest) => {
		let response;

		try {
			response = await authResetPassword(values);
		} catch (e) {
			console.error(e);
			return {[FORM_ERROR]: 'Unknown error occurred'};
		}

		if (!response) {
			return;
		}

		return createFromValidationResult(response as ValidationResult);
	}, []);

	const classes = useStyle();

	const backToLogin = (
		<Typography
			color="primary"
			component="div"
			className={classes.bottom}
		>
			<Link
				component={RouterLink}
				to={AUTH_LOGIN}
			>
				Go Back To&nbsp;
				<span style={{fontWeight: 'bolder'}}>Login</span>
			</Link>
		</Typography>
	);

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
					{(props) => {
						if (props.submitSucceeded) {
							return (
								<div style={{textAlign: 'center'}}>
									<Typography>
										Your password has been reset. Please check your email for password update link.
									</Typography>
								</div>
							);
						}

						return (
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

								<div style={{textAlign: 'center'}}>
									<Button
										type="submit"
										color="primary"
										variant="contained"
										fullWidth={true}
										disabled={props.submitting}
										style={{margin: '20px 0', fontSize: '1rem'}}
									>
										Reset Password
									</Button>
								</div>
							</form>
						);
					}}
				</Form>
			</div>

			{backToLogin}
		</Container>
	);
};
