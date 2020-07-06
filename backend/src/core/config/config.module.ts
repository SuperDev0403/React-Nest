import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import http from 'src/config/http';
import security from '../../config/security';
import twilio from '../../config/twilio';
import debug from '../../config/debug';
import nodemailer from '../../config/nodemailer';
import auth from '../../config/auth';
import firebaseAdmin from '../../config/firebase.admin';

const configuration = [
	http, security, twilio, debug, nodemailer, auth, firebaseAdmin,
];

const modules = [
	NestConfigModule.forRoot({
		load: configuration,
	}),
];

@Module({
	imports: modules,
	exports: modules,
})
export class ConfigModule {
}
