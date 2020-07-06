import React, { ChangeEvent, FunctionComponent, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import { createFromValidationResult } from '../../../../lib/final-form/submission.error';
import { ValidationResult } from '../../../../lib/validator/validation.result';
import { Field, Form } from 'react-final-form';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import Alert from '@material-ui/lab/Alert/Alert';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { getError, hasError } from '../../../../lib/final-form/field.meta';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button';
import { updateUser, UpdateUserRequest } from '../../../../api/sdk/user/update.user';
import { getAuthorizedUserSelector } from '../../../module/auth/auth.selector';
import { authorizationResult } from '../../../module/auth/auth.action';
import FormControl from '@material-ui/core/FormControl';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import FormHelperText from '@material-ui/core/FormHelperText';
import { uploadFile } from '../../../../api/sdk/file/upload.file';

export const EditUserDialog: FunctionComponent<{
	isOpen?: boolean;
	onClose: () => void;
}> = (props) => {
	const {isOpen, onClose} = props;

	const dispatch = useDispatch();
	const authorizedUser = useSelector(getAuthorizedUserSelector);

	const initialValues = useMemo(() => {
		const {firstName, lastName} = authorizedUser || {};
		return {firstName, lastName};
	}, [isOpen, authorizedUser]);

	const onSubmit = useCallback(async (values: UpdateUserRequest) => {
		const data = {...values};

		// if image is submitted
		// upload the image first and then use it's URL
		if (!!data.imageUrl) {
			const uploadResponse = await uploadFile({file: (data.imageUrl as File)});
			data.imageUrl = uploadResponse.fileUrl;
		}

		let response;

		try {
			response = await updateUser(data);
		} catch (e) {
			console.error(e);
			return {[FORM_ERROR]: 'Unknown error occurred'};
		}

		if ('user' in response && !!response.user) {
			dispatch(authorizationResult(response.user));
			onClose();
		}

		return createFromValidationResult(response as ValidationResult);
	}, [dispatch, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<Form
			onSubmit={onSubmit}
			keepDirtyOnReinitialize={false}
			initialValues={initialValues}
			initialValuesEqual={(a, b) => a === b}
		>
			{({handleSubmit, submitting, ...props}) => (
				<Dialog open={!!isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
					<form onSubmit={handleSubmit}>
						<DialogTitle id="form-dialog-title">
							Update Profile
						</DialogTitle>

						{!!props.error && (
							<Alert severity="warning">{props.error}</Alert>
						)}
						{!!props.submitError && (
							<Alert severity="error">{props.submitError}</Alert>
						)}

						<DialogContent>
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
						</DialogContent>
						<DialogActions>
							<Button onClick={onClose} color="primary">
								Cancel
							</Button>
							<Button type="submit" color="primary">
								Submit
							</Button>
						</DialogActions>
					</form>
				</Dialog>
			)}
		</Form>
	);
};
