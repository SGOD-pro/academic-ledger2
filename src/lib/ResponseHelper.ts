type SuccessResponse<T> = {
	success: true;
	data: T;
	message?: string;
};

type ErrorResponse = {
	success: false;
	error: string;
	message?: string;
};

class ApiResponse {
	static success<T>(
		data: T,
		statusCode: number = 200,
		message: string = ""
	): Response {
		const responseBody: SuccessResponse<T> = {
			success: true,
			data,
			message,
		};

		return Response.json({ ...responseBody }, { status: statusCode });
	}
	static error(message: string, statusCode: number = 400): Response {
		const responseBody: ErrorResponse = {
			success: false,
			error: message,
		};

		return Response.json({ ...responseBody }, { status: statusCode });
	}
}

export default ApiResponse;
