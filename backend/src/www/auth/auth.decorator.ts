import { createParamDecorator } from '@nestjs/common';
import { User } from '../../core/user/model/user.entity';

export const AuthUser = createParamDecorator((data, req): User | undefined => {
	return req.user;
});
