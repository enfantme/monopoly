export interface Player {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export interface Transaction {
  id: number;
  fromId: string;
  toId: string;
  amount: number;
  description: string;
  timestamp: Date;
}