/*
 * App server
 *  - bootstraps the DI container
 *  - sets express app configuration
 *  - adds global request/response interceptors and pipes
 *  - starts http server
 */

import { NestFactory, Reflector } from '@nestjs/core';
import { WwwModule } from './www/www.module';
import { ConfigService } from '@nestjs/config';
import { CONFIG_TOKEN } from './config/http';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
	const app = await NestFactory.create(WwwModule);
	const options = app.get(ConfigService).get(CONFIG_TOKEN);

	app.enableCors(options.cors);
	app.use(json({limit: '50mb'}));

	const reflector = app.get(Reflector);
	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		whitelist: true,
	}));

	await app.listen(options.server.port);
}

bootstrap();
