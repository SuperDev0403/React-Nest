import React, { ChangeEvent, FunctionComponent, useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { getError, hasError } from '../../../../lib/final-form/field.meta';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import { AUTH_LOGIN } from '../../../routing/route';
import { useDispatch } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import { authorizationResult } from '../../../module/auth/auth.action';
import { authRegister, AuthRegisterRequest } from '../../../../api/sdk/auth/auth.register';
import { createFromValidationResult } from '../../../../lib/final-form/submission.error';
import { ValidationResult } from '../../../../lib/validator/validation.result';
import Container from '@material-ui/core/Container';
import { createStyles, Link, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { uploadFile } from '../../../../api/sdk/file/upload.file';

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

export const RegistrationScreen: FunctionComponent = () => {
	const dispatch = useDispatch();

	const onSubmit = useCallback(async (values: AuthRegisterRequest) => {
		const data = {...values};

		// if image is submitted
		// upload the image first and then use it's URL
		if (!!data.imageUrl) {
			const uploadResponse = await uploadFile({file: (data.imageUrl as File)});
			data.imageUrl = uploadResponse.fileUrl;
		}

		let response;

		try {
			response = await authRegister(data);
		} catch (e) {
			console.error(e);
			return {[FORM_ERROR]: 'Unknown error occurred'};
		}

		if ('user' in response && !!response.user) {
			dispatch(authorizationResult(response.user));
			return;
		}

		return createFromValidationResult(response as ValidationResult);

	}, [dispatch]);

	const classes = useStyle();

	return (
		<Container
			component="main"
			maxWidth="xs"
			className={classes.container}
		>
			<div className={classes.form}>
				<Form onSubmit={onSubmit}>
					{(props) => (
						<form onSubmit={props.handleSubmit}>
							{!!props.error && (
								<Alert severity="warning">{props.error}</Alert>
							)}
							{!!props.submitError && (
								<Alert severity="error">{props.submitError}</Alert>
							)}

							<Field name="firstName">
								{(props) => (
									<TextField
										{...props.input}
										label="First Name"
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										variant="outlined"
										margin="normal"
										fullWidth
									/>
								)}
							</Field>

							<Field name="lastName">
								{(props) => (
									<TextField
										{...props.input}
										label="Last Name"
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										variant="outlined"
										margin="normal"
										fullWidth
									/>
								)}
							</Field>

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

							<Field name="phoneNumber">
								{(props) => (
									<TextField
										{...props.input}
										label="Phone Number"
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										variant="outlined"
										margin="normal"
										fullWidth
									/>
								)}
							</Field>

							<Field name="imageUrl">
								{(props) => {
									const {value, ...inputProps} = props.input;

									return (
										<FormControl margin="normal">
											<input
												{...inputProps}
												onChange={(event: ChangeEvent<HTMLInputElement>) => inputProps.onChange(event.target.files?.[0])}
												color="primary"
												accept="image/*"
												type="file"
												id="icon-button-file"
												style={{display: 'none'}}
											/>
											<label htmlFor="icon-button-file">
												<Button
													variant="contained"
													component="span"
													size="large"
													color="primary"
													startIcon={<AddAPhotoOutlinedIcon/>}
												>
													Add photo
												</Button>
												&nbsp;&nbsp;
												{!!props.input.value && (
													<Typography component="span">
														{(props.input.value as File).name}
													</Typography>
												)}
											</label>
											{hasError(props.meta) && (
												<FormHelperText error={true}>
													{getError(props.meta)}
												</FormHelperText>
											)}
										</FormControl>
									);
								}}
							</Field>

							<Field name="plainPassword">
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
									style={{margin: '20px 0', fontSize: '1rem'}}>Register</Button>
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
					to={AUTH_LOGIN}
				>
					Already Have An Account?&nbsp;
					<span style={{fontWeight: 'bolder'}}>Login</span>
				</Link>
			</Typography>
		</Container>
	);
};

