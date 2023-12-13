/* eslint-disable @typescript-eslint/no-explicit-any */
import { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
	request: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> => {
	await new Promise(() => setTimeout(() => {}, 0));

	return request;
};
