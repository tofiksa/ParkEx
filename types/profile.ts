/**
 * Profile and auth user type definitions
 * Centralized types for user-related data structures
 */

/** User role type */
export type UserRole = "buyer" | "seller";

/** Profile from database */
export type Profile = {
	id: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	role?: UserRole;
	phone?: string;
	address?: string;
	created_at?: string;
};

/** Auth user with metadata from Supabase */
export type AuthUser = {
	id: string;
	email?: string;
	user_metadata?: {
		full_name?: string;
		name?: string;
		first_name?: string;
		last_name?: string;
		given_name?: string;
		family_name?: string;
		email?: string;
		avatar_url?: string;
		iss?: string;
	};
	app_metadata?: {
		provider?: string;
	};
};

/** Profile form data for submission */
export type ProfileFormData = {
	firstName: string;
	lastName: string;
	email: string;
	role: "" | UserRole;
	phone: string;
	address: string;
};
