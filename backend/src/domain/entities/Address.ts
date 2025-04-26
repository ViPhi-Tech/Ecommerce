import { Partner } from './Partner';

export interface Address {
    id: number;
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
    partnerId?: number;
    clientId?: number;
    userId?: number;
    partner?: Partner;
}