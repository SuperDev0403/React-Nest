export class GetListQueryData {
	orderBy?: { [propertyPath: string]: 'asc' | 'desc' };
	pagination?: {
		offset?: number;
		limit?: number;
	};
	include?: { [propertyPath: string]: 'asc' | 'desc' };
	withDeleted?: boolean;
}
