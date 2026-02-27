
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TransformStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  DRAFT = 'DRAFT',
  ERROR = 'ERROR'
}

export interface Transformation {
  id: string;
  name: string;
  timestamp: string;
  status: TransformStatus;
  thumbnail: string;
  credits: number;
  format: 'GLB' | 'OBJ' | 'STL';
  polyCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  downloads: number;
  avatar: string;
  plan: string;
}

export interface PaymentMethod {
  id: string;
  provider: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  fixedFee: number;
  variableFee: number;
}
