import { jsonRequest } from '../../request/request';
import { url } from '../../routing/url';

export const GET_PEER_CONNECTION_CONFIG = url('/call/peer-connection/config');

export interface GetPeerConnectionConfigResponse extends Partial<RTCConfiguration> {

}

export async function getPeerConnectionConfig(): Promise<GetPeerConnectionConfigResponse> {
	const response = await jsonRequest(GET_PEER_CONNECTION_CONFIG);
	return response.json();
}
