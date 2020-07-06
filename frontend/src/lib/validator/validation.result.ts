export interface ConstraintViolation {
	property: string;
	constraints: {
		[key: string]: string;
	};
}

export interface ValidationResult {
	errorList: ConstraintViolation[];
	errorMessage: string;
}
