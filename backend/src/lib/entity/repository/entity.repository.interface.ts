export interface FindOneQuery {
	id?: string;
}

export interface FindListQuery {
	idList?: string[];
}

export interface EntityRepositoryInterface<Entity> {
	findOneBy(query: FindOneQuery): Promise<Entity | undefined>;

	findBy(query: FindListQuery): Promise<Entity[]>;

	save(entity: Entity): Promise<Entity>;

	saveBatch(entityList: Entity[]): Promise<Entity[]>;

	remove(entity: Entity): Promise<Entity>;

	removeBatch(entityList: Entity[]): Promise<Entity[]>;
}
