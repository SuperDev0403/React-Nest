/*
 * CLI entry point
 *  - bootstraps the DI container
 *  - runs the CLI handler
 */

import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { CliModule } from './cli/cli.module';

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(CliModule, {
		logger: false,
	});

	return app.select(CommandModule).get(CommandService).exec();
}

bootstrap();
