import { FieldMetaState } from 'react-final-form';

const isString = (value: unknown) => typeof value === 'string';

const isError = (value: unknown) => isString(value) || Array.isArray(value);

export function hasError<FieldValue>(meta: FieldMetaState<FieldValue>): boolean {
	if (!!meta.error && isError(meta.error)) {
		return true;
	}

	if (!!meta.submitError && isError(meta.submitError)) {
		return true;
	}

	return false;
}

export function getError<FieldValue>(meta: FieldMetaState<FieldValue>): string | undefined {
	if (meta.error && isError(meta.error)) {
		return Array.isArray(meta.error) ? meta.error[0] : meta.error;
	}

	if (meta.submitError && isError(meta.submitError)) {
		return Array.isArray(meta.submitError) ? meta.submitError[0] : meta.submitError;
	}

	return undefined;
}
