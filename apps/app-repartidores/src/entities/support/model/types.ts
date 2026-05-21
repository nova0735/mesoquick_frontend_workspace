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

// --- CHATBOT DTOs ---
export interface ChatbotAction {
  type: 'COMPENSATION' | 'REDIRECT_TO_HUMAN' | 'INFO';
  amount?: number;
}

export interface ChatbotMessageRequest {
  text: string;
  orderId?: string;
}

export interface ChatbotMessageResponse {
  replyText: string;
  action: ChatbotAction;
}

// --- WEBSOCKET & RESOLUTION DTOs ---
export type ResolutionStatus = 'APPROVED' | 'REJECTED';

export interface TariffResolutionData {
  orderId: string;
  status: ResolutionStatus;
  finalTariffAmount?: number;
  agentNotes?: string;
}

export interface CancelResolutionData {
  orderId: string;
  status: ResolutionStatus;
  penaltyApplied: boolean;
  agentNotes?: string;
}

export interface WsNotificationPayload<T> {
  eventType: 'TARIFF_RESOLUTION' | 'CANCEL_RESOLUTION' | 'SYSTEM_ALERT';
  data: T;
  timestamp: string;
}

// --- LIVE CHAT DTOs ---
export type ChatSenderRole = 'COURIER' | 'AGENT' | 'SYSTEM';

export interface ChatMessageOutgoing {
  text: string;
}

export interface ChatMessageIncoming {
  messageId: string;
  senderId: string;
  senderRole: ChatSenderRole;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessageIncoming[];
}
