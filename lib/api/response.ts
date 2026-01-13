import { NextResponse } from "next/server";
import { incCounter } from "@/lib/metrics";

export type ApiError = {
	error: string;
	code?: string;
};

export type ApiSuccess<T = unknown> = {
	ok: true;
	data?: T;
};

export type ApiResponse<T = unknown> = ApiError | ApiSuccess<T>;

/**
 * Standard API response helpers
 */
export const apiResponse = {
	/**
	 * Return a successful response
	 */
	success<T>(data?: T, route?: string) {
		if (route) {
			incCounter("api_requests_total", { route, status: 200 });
		}
		return NextResponse.json({ ok: true, data } as ApiSuccess<T>);
	},

	/**
	 * Return an error response
	 */
	error(message: string, status: number, route?: string) {
		if (route) {
			incCounter("api_requests_total", { route, status });
		}
		return NextResponse.json({ error: message } as ApiError, { status });
	},

	/**
	 * 400 Bad Request
	 */
	badRequest(message = "Invalid request", route?: string) {
		return apiResponse.error(message, 400, route);
	},

	/**
	 * 401 Unauthorized
	 */
	unauthorized(message = "Unauthorized", route?: string) {
		return apiResponse.error(message, 401, route);
	},

	/**
	 * 403 Forbidden
	 */
	forbidden(message = "Forbidden", route?: string) {
		return apiResponse.error(message, 403, route);
	},

	/**
	 * 404 Not Found
	 */
	notFound(message = "Not found", route?: string) {
		return apiResponse.error(message, 404, route);
	},

	/**
	 * 500 Internal Server Error
	 */
	serverError(message = "Internal server error", route?: string) {
		return apiResponse.error(message, 500, route);
	},

	/**
	 * Supabase config missing error
	 */
	supabaseConfigMissing(route?: string) {
		return apiResponse.error("Supabase config missing", 500, route);
	},
};
