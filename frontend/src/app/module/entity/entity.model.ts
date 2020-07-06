export enum EntityMergeMode {
	REPLACE = 'replace',
	MERGE = 'merge'
}

export interface EntityData {
	[entityName: string]: {
		[entityId: string]: object
	}
}
