import { AxiosResponse } from 'axios';

export const responseInterceptor = async (response: AxiosResponse): Promise<AxiosResponse> => {
	await new Promise(() => setTimeout(() => {}, 0));

	return response;
};
