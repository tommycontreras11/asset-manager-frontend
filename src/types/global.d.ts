declare global {
	interface IResponse<T> {
		data: T;
        message?: string
	}

	interface ISignInResponse {
		token: string;
        message?: string
	}

	interface IErrorResponse {
		message: string;
		title?: string;
	}

}

export {};
