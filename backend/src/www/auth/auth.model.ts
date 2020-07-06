import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { User } from '../../core/user/model/user.entity';

export class SessionDto {
	user: User;
	accessToken: string;
	refreshToken: string;
}

export class AccessTokenDto {
	accessToken: string;
}

export interface JwtPayload {
	id: User['id'];
	email: User['email'];
	type: 'access_token' | 'refresh_token';
}

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	@Transform((value?: string) => !!value ? value.toLowerCase() : value)
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
