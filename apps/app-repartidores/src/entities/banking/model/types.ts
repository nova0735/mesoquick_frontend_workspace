export type BankAccountType = 'MONETARY' | 'SAVINGS';
export type CardType = 'DEBIT' | 'CREDIT';

export interface BankInstitution {
  id: string;
  name: string;
}

export interface LinkedBankAccount {
  bankId: string;
  bankName: string;
  accountType: BankAccountType;
  accountNumber: string;
}

export interface LinkedCard {
  cardId: string;
  cardNumber: string;
  expirationDate: string;
  cardType: CardType;
  brand: string;
}

export interface BankingInstitutionsResponse {
  banks: BankInstitution[];
  accountTypes: BankAccountType[];
}

export interface MyAccountsResponse {
  bankAccount: LinkedBankAccount;
  card: LinkedCard;
}

export interface UpdateBankAccountRequest {
  bankId: string;
  accountType: BankAccountType;
  accountNumber: string;
}

export interface GenericApiResponse {
  message: string;
}
