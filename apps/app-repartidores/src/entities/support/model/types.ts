export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  categoryName: string;
  items: FAQItem[];
}

export interface ContactMethod {
  id: string;
  label: string;
  value: string; 
}

export interface FAQsResponse {
  categories: FAQCategory[];
}

export interface SupportDirectoryResponse {
  phones: ContactMethod[];
  emails: ContactMethod[];
}

export type TariffIncreaseReason = 'CLIMATE' | 'SCHEDULE' | 'TRAFFIC';

export interface ProposeTariffRequest {
  orderId: string;
  reason: TariffIncreaseReason;
  proposedIncrease: number;
}

export interface CancelOrderRequest {
  orderId: string;
  reason: string;
}

export interface UploadEvidenceResponse {
  message: string;
  url: string;
}

export interface CreateDisputeRequest {
  ticketTitle: string;
  detail: string;
  evidenceUrl?: string;
}

export interface CreateDisputeResponse {
  message: string;
  ticketId: string;
}

export interface GenericSupportResponse {
  message: string;
}
