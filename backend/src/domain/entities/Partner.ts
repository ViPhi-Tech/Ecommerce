import { $Enums } from "../../infrastructure/database/prismaClient";
type PartnerType = $Enums.PartnerType;

export interface Partner {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  document?: string | null;
  type: PartnerType;
}

