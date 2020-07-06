import { FORM_ERROR, SubmissionErrors } from 'final-form';
import set from 'lodash/set';
import { ValidationResult } from '../validator/validation.result';

export function createFromValidationResult(result: ValidationResult): SubmissionErrors {
	const errors: SubmissionErrors = {};

	for (let violation of (result.errorList || [])) {
		const constraintMessages = Object.values(violation.constraints);

		if (constraintMessages.length > 0) {
			set(errors, violation.property, constraintMessages);
		}
	}

	if (!!result.errorMessage) {
		errors[FORM_ERROR] = result.errorMessage;
	}

	return errors;
}

export function createFromObject(object: object) {
	return object as SubmissionErrors;
}
