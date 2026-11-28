export interface PagedResult<T> {
  items: T[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface Community {
  id: number;
  name: string;
  neighbourhood: string;
  city: string;
  country: string;
  status: number;
  statusName: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Member {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  address: string;
  statusName: string;
  membershipTypeName?: string | null;
  isVerified: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export interface InventoryItem {
  id: number;
  toolModel: string;
  serialNumber: string;
  statusName: string;
  condition: number;
  conditionName: string;
  currentHolderName?: string | null;
  isUnderRepair: boolean;
}

export interface Loan {
  id: number;
  toolModel: string;
  serialNumber: string;
  currentHolderName?: string | null;
  originalOwnerName?: string | null;
  lastBorrowedDate?: string | null;
  loanCount: number;
  conditionName: string;
  isUnderRepair: boolean;
}

export interface Reservation {
  id: number;
  toolModel: string;
  itemSerialNumber: string;
  memberName: string;
  reservationDate: string;
  expiryDate: string;
  statusName: string;
}

export interface Donation {
  id: number;
  donorName: string;
  item: string;
  quantity: number;
  eventName: string;
  donationDate?: string | null;
}

export interface SoupEvent {
  id: number;
  name: string;
  description: string;
  eventDate?: string | null;
  statusName: string;
}

export interface Guest {
  id: number;
  name: string;
  contactInfo?: string | null;
  guestCount: number;
  eventName: string;
  statusName: string;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  eventName: string;
  categoryName: string;
  quantityPrepared?: number | null;
  quantityNeeded?: number | null;
}

export interface Volunteer {
  id: number;
  memberName: string;
  eventName: string;
  roleName: string;
  statusName: string;
  hoursScheduled?: number | null;
}

export interface LearningPage<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface LearningDeck {
  id: number;
  name: string;
  cardCount: number;
  dueCount: number;
  createdAt: string;
}

export interface LearningCard {
  id: number;
  cue: string;
  expectedAnswer: string;
  box: number;
  dueAt: string;
  reviewCount: number;
  lapseCount: number;
}

export interface PracticeCard {
  cardId: number;
  deckId: number;
  deckName: string;
  cue: string;
  box: number;
}

export interface ReviewOutcome {
  box: number;
  dueAt: string;
}

export interface CalibrationRow {
  confidence: number;
  confidenceName: string;
  reviews: number;
  correct: number;
}

export interface LearningStats {
  totalDecks: number;
  totalCards: number;
  dueNow: number;
  totalReviews: number;
  calibration: CalibrationRow[];
}
