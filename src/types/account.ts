export interface Account {
  id: string;
  name: string;
  type: string; // 'Cash', 'Bank', 'CreditCard', 'Investment', 'Other'
  balance: number;
  currency: string;
  description?: string;
  isDefault?: boolean;
  institution?: string;
  accountNumber?: string;
  creditLimit?: number; // Only for credit cards
  closingDay?: number; // Only for credit cards
  paymentDay?: number; // Only for credit cards
}

export interface CreateAccountRequest {
  name: string;
  type: string;
  currency: string;
  initialBalance?: number;
  description?: string;
  isDefault?: boolean;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: string;
  currency?: string;
  description?: string;
  isDefault?: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  currency: string;
  accountsCount: number;
}
