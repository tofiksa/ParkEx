/**
 * Bid type definitions
 * Centralized types for bid-related data structures
 */

/** Bid from database */
export type Bid = {
	id?: string;
	garage_id: string;
	bidder_id: string;
	amount: number;
	created_at: string;
};

/** Bid display item (subset of fields) */
export type BidDisplay = {
	amount: number;
	created_at: string;
	bidder_id: string;
};

/** Realtime bid payload from Supabase */
export type RealtimeBidPayload = {
	new: {
		id: string;
		garage_id: string;
		amount: number;
		created_at: string;
	};
};

/** Bid API request payload */
export type BidRequest = {
	garageId: string;
	amount: number;
};
