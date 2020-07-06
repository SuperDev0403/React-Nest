import { Module } from '@nestjs/common';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

const modules = [
	NestTypeOrmModule.forRoot(),
];

@Module({
	imports: modules,
	exports: modules,
})
export class TypeOrmModule {
}
