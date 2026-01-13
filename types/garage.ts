/**
 * Garage type definitions
 * Centralized types for garage-related data structures
 */

/** Base garage properties from database */
export type GarageBase = {
	id: string;
	title: string;
	address: string;
	start_price: number;
	bid_end_at: string;
};

/** Garage with bid information for listings */
export type GarageWithBid = {
	id: string;
	title: string;
	address: string;
	startPrice: number;
	bidEndAt: string;
	highestBid: number | null;
	lastBidAt?: string | null;
	bidCount?: number;
	isActive?: boolean;
};

/** Full garage detail from database */
export type GarageDetail = GarageBase & {
	size: string;
	description: string | null;
	images: string[] | null;
	owner_id: string;
	created_at: string;
};

/** Garage for carousel display */
export type GarageCarouselItem = {
	id: string;
	title: string;
	address: string;
	startPrice: number;
	bidEndAt: string;
	highestBid: number | null;
	lastBidAt: string | null;
};
