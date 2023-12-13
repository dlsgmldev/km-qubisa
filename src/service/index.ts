import axios from 'axios'
import { create } from 'apisauce'
import { requestInterceptor, responseInterceptor } from './interceptors';

const customAxiosInstance = axios.create({ baseURL: "https://apidls.onegml.com/" })

export const apisauceInstance = create({
    axiosInstance: customAxiosInstance,
    baseURL: undefined
})

apisauceInstance.axiosInstance.interceptors.request.use(requestInterceptor);
apisauceInstance.axiosInstance.interceptors.response.use(responseInterceptor);