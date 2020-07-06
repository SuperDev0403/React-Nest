import { ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class ValidationResult {
	errorList?: ValidationError[];
	errorMessage?: string;

	static create(data: object) {
		return plainToClass(ValidationResult, data);
	}
}
