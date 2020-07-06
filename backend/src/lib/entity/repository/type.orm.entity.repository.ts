import { Equal, FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { EntityRepositoryInterface, FindListQuery, FindOneQuery } from './entity.repository.interface';

export abstract class TypeOrmEntityRepository<Entity> implements EntityRepositoryInterface<Entity> {

	protected readonly repository: Repository<Entity>;

	async findOneBy(query: FindOneQuery): Promise<Entity | undefined> {
		const where: FindOneOptions['where'] = {};

		for (const property of Object.keys(query)) {
			where[property] = Equal(query[property]);
		}

		return this.repository.findOne({where});
	}

	async findBy(query: FindListQuery): Promise<Entity[]> {
		const where: FindManyOptions['where'] = {};

		if (!!query.idList) {
			where.id = In(query.idList);
		}

		return this.repository.find({where});
	}

	async save(entity: Entity) {
		return this.repository.save(entity);
	}

	async saveBatch(entityList: Entity[]) {
		return this.repository.save(entityList);
	}

	async remove(entity: Entity) {
		return this.repository.remove(entity);
	}

	async removeBatch(entityList: Entity[]) {
		return this.repository.remove(entityList);
	}

}
