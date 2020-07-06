import { Injectable } from '@nestjs/common';
import { UserEntityRepository } from '../../core/user/repository/user.entity.repository';
import { plainToClass } from 'class-transformer';
import { AccessTokenDto, JwtPayload, LoginDto, SessionDto } from './auth.model';
import { User } from '../../core/user/model/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BCryptPasswordEncoder } from '../../lib/security/encoder/bcrypt.password.encoder';

@Injectable()
export class AuthService {

	constructor(
		private readonly userRepository: UserEntityRepository,
		private readonly jwtService: JwtService,
		private readonly passwordEncoder: BCryptPasswordEncoder,
	) {
	}

	async authorizeLogin(data: LoginDto): Promise<User | undefined> {
		const user = await this.userRepository.findOneForAuth({email: data.email});

		if (!user) {
			return undefined;
		}

		const isEqual = await this.passwordEncoder.isEqual(user.password, data.password);

		if (!isEqual) {
			return undefined;
		}

		return user;
	}

	async authorizeJwt(payload: JwtPayload): Promise<User | undefined> {
		const user = await this.userRepository.findOneBy({id: payload.id});

		if (!user) {
			return undefined;
		}

		return user;
	}

	async createSession(user: User): Promise<SessionDto> {
		const accessToken = await this.createAccessToken(user);
		const refreshToken = await this.createRefreshToken(user);

		return plainToClass(SessionDto, {
			accessToken,
			refreshToken,
			user,
		});
	}

	async refreshSession(user: User): Promise<AccessTokenDto> {
		const accessToken = await this.createAccessToken(user);
		return plainToClass(AccessTokenDto, {accessToken});
	}

	async createAccessToken(user: User) {
		const payload = {email: user.email, id: user.id, type: 'access_token'};

		return this.jwtService.sign(payload, {expiresIn: '1d'});
	}

	async createRefreshToken(user: User) {
		const payload = {email: user.email, id: user.id, type: 'refresh_token'};

		return this.jwtService.sign(payload, {expiresIn: '356d'});
	}
}
