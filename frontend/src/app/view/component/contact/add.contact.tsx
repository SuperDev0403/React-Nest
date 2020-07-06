import React, { FunctionComponent, useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { getError, hasError } from '../../../../lib/final-form/field.meta';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { DialogContentText } from '@material-ui/core';
import { FORM_ERROR } from 'final-form';
import { createFromValidationResult } from '../../../../lib/final-form/submission.error';
import { ValidationResult } from '../../../../lib/validator/validation.result';
import { addContact, AddContactRequest } from '../../../../api/sdk/user/add.contact';
import { useDispatch } from 'react-redux';
import { addContactResult } from '../../../module/contact-list/contact.list.action';

export const AddContactDialog: FunctionComponent<{
	isOpen?: boolean;
	onClose: () => void;
}> = (props) => {
	const {isOpen, onClose} = props;

	const dispatch = useDispatch();

	const onContactSubmit = useCallback(async (values: AddContactRequest) => {
		let response;

		try {
			response = await addContact(values);
		} catch (e) {
			console.error(e);
			return {[FORM_ERROR]: 'Unknown error occurred'};
		}

		if ('contact' in response && !!response.contact) {
			dispatch(addContactResult(response.contact));
			onClose();
		}

		return createFromValidationResult(response as ValidationResult);
	}, [dispatch, onClose]);

	return (
		<Form
			onSubmit={onContactSubmit}
			keepDirtyOnReinitialize={false}
			initialValuesEqual={(a, b) => a === b}
		>
			{({handleSubmit, submitting, ...props}) => (
				<Dialog open={!!isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
					<form onSubmit={handleSubmit}>
						<DialogTitle id="form-dialog-title">
							Add New Contact
						</DialogTitle>

						{!!props.error && (
							<Alert severity="warning">{props.error}</Alert>
						)}
						{!!props.submitError && (
							<Alert severity="error">{props.submitError}</Alert>
						)}

						<DialogContent>
							<DialogContentText>
								Enter user's email or phone number.
							</DialogContentText>

							<Field name="emailOrPhone">
								{(props) => (
									<TextField
										{...props.input}
										label="Email or Phone"
										error={hasError(props.meta)}
										helperText={getError(props.meta)}
										autoFocus
										margin="dense"
										fullWidth
									/>
								)}
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
