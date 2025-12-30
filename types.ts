
export type DrinkType = 'Vodka' | 'Whiskey' | 'Beer' | 'None';

export interface RSVPData {
  id?: string;
  name: string;
  has_guests: boolean;
  guest_count: number;
  total_people: number;
  will_drink: boolean;
  drink_type: DrinkType;
  snack_suggestions?: string;
  special_notes?: string;
  total_amount: number;
  created_at?: string;
}

export interface AdminStats {
  totalPeople: number;
  totalAmount: number;
  drinkCounts: Record<string, number>;
  totalEntries: number;
}
