import api from './api';

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  accountNumber?: string;
  institutionName?: string;
  status: 'Active' | 'Inactive';
}

export interface CreateAccountRequest {
  name: string;
  type: string;
  initialBalance: number;
  currency: string;
  color?: string;
  icon?: string;
  accountNumber?: string;
  institutionName?: string;
}

export interface UpdateAccountRequest {
  name: string;
  type: string;
  currency: string;
  color?: string;
  icon?: string;
  accountNumber?: string;
  institutionName?: string;
  isActive: boolean;
}

export interface AccountSummary {
  totalBalance: number;
  accountCount: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  description?: string;
}

export interface TransferResponse {
  id: string;
  fromAccountId: string;
  fromAccountName: string;
  toAccountId: string;
  toAccountName: string;
  amount: number;
  date: string;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  provider?: string;
  lastFourDigits?: string;
}

export interface CreatePaymentMethodRequest {
  name: string;
  type: string;
  isDefault: boolean;
  provider?: string;
  lastFourDigits?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bankName: string;
  creditLimit: number;
  currentBalance: number;
  closingDay: number;
  dueDay: number;
  color?: string;
}

export interface CreateCreditCardRequest {
  name: string;
  bankName: string;
  creditLimit: number;
  closingDay: number;
  dueDay: number;
  color?: string;
}

const getAccounts = async (activeOnly = true) => {
  const response = await api.get<{ data: Account[] }>(`/api/Accounts`, {
    params: { activeOnly }
  });
  return response.data.data || [];
};

const getAccountById = async (id: string) => {
  const response = await api.get<{ data: Account }>(`/api/Accounts/${id}`);
  return response.data.data;
};

const createAccount = async (data: CreateAccountRequest) => {
  const response = await api.post<{ data: Account }>(`/api/Accounts`, data);
  return response.data.data;
};

const updateAccount = async (id: string, data: UpdateAccountRequest) => {
  const response = await api.put<{ data: Account }>(`/api/Accounts/${id}`, data);
  return response.data.data;
};

const deleteAccount = async (id: string) => {
  await api.delete(`/api/Accounts/${id}`);
};

const getAccountSummary = async () => {
  const response = await api.get<{ data: AccountSummary }>('/api/Accounts/summary');
  return response.data.data;
};

const transfer = async (data: TransferRequest) => {
  const response = await api.post<{ data: TransferResponse }>('/api/Accounts/transfer', data);
  return response.data.data;
};

const getTransfers = async (fromDate?: string, toDate?: string) => {
  const response = await api.get<{ data: TransferResponse[] }>('/api/Accounts/transfers', {
    params: { fromDate, toDate }
  });
  return response.data.data || [];
};

const getPaymentMethods = async () => {
  const response = await api.get<{ data: PaymentMethod[] }>('/api/Accounts/payment-methods');
  return response.data.data || [];
};

const createPaymentMethod = async (data: CreatePaymentMethodRequest) => {
  const response = await api.post<{ data: PaymentMethod }>('/api/Accounts/payment-methods', data);
  return response.data.data;
};

const setDefaultPaymentMethod = async (id: string) => {
  await api.put(`/api/Accounts/payment-methods/${id}/set-default`);
};

const getCreditCards = async () => {
  const response = await api.get<{ data: CreditCard[] }>('/api/Accounts/credit-cards');
  return response.data.data || [];
};

const createCreditCard = async (data: CreateCreditCardRequest) => {
  const response = await api.post<{ data: CreditCard }>('/api/Accounts/credit-cards', data);
  return response.data.data;
};

export const accountService = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
  transfer,
  getTransfers,
  getPaymentMethods,
  createPaymentMethod,
  setDefaultPaymentMethod,
  getCreditCards,
  createCreditCard
};
