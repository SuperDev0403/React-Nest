export class GetOneQueryData {
	orderBy?: { [propertyPath: string]: 'asc' | 'desc' };
	include?: { [propertyPath: string]: 'asc' | 'desc' };
	withDeleted?: boolean;
}
