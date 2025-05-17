import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from '@/hooks/use-toast'; // Adjust this based on your toast import

class ApiService<Tx> {
	private baseUrl: string;
	private axiosInstance: AxiosInstance;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl,
		});
	}

	private showToast(response: ApiServicesResponse<any>, action: string) {
		if (response.success) {
			toast({
				title: "Success",
				description: `${action} operation completed successfully.`,
			});
		} else {
			toast({
				title: "Error",
				description: response.error?.message || "Something went wrong",
				variant: "destructive",
			});
		}
	}

	async get<T>(endpoint: string, showToast = true): Promise<ApiServicesResponse<T>> {
		const action = "GET";
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint);
			const result = {
				success: true,
				data: response.data,
				error: null,
			};
			if (showToast) this.showToast(result, action);
			return result;
		} catch (error: any) {
			const result = {
				success: false,
				error: new Error(error.response?.data?.message || error.message || "An unknown error occurred"),
			};
			if (showToast) this.showToast(result, action);
			return result;
		}
	}

	async post<T>(endpoint: string, data: Tx, isMultipart = false, showToast = true): Promise<ApiServicesResponse<T>> {
		const action = "POST";
		try {
			const headers = isMultipart ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
			const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data, { headers });
			const result = {
				success: true,
				data: response.data,
				error: null,
			};
			if (showToast) this.showToast(result, action);
			return result;
		} catch (error: any) {
			const result = {
				success: false,
				error: new Error(error.response?.data?.message || error.message || "An unknown error occurred"),
			};
			if (showToast) this.showToast(result, action);
			return result;
		}
	}

	async put<T>(endpoint: string, data: Tx, isMultipart = false, showToast = true): Promise<ApiServicesResponse<T>> {
		const action = "Update";
		try {
			const headers = isMultipart ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" };
			const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data, { headers });
			const result = {
				success: true,
				data: response.data,
				error: null,
			};
			if (showToast) this.showToast(result, action);
			return result;
		} catch (error: any) {
			const result = {
				success: false,
				error: new Error(error.response?.data?.message || error.message || "An unknown error occurred"),
			};
			if (showToast) this.showToast(result, action);
			return result;
		}
	}

	async delete<T>(endpoint: string, showToast = true): Promise<ApiServicesResponse<T>> {
		const action = "DELETE";
		try {
			const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint);
			const result = {
				success: true,
				data: response.data,
				error: null,
			};
			if (showToast) this.showToast(result, action);
			return result;
		} catch (error: any) {
			const result = {
				success: false,
				error: new Error(error.response?.data?.message || error.message || "An unknown error occurred"),
			};
			if (showToast) this.showToast(result, action);
			return result;
		}
	}
}

export default ApiService;

