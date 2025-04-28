import { PartnerType } from "./PartnerType";

export interface PartnerResponse {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  document?: string | null;
  type: PartnerType;
}

