
export interface SupplierValue {
  id: string;
  name: string;
  amount: number;
}

export interface SectionData {
  suppliers: SupplierValue[];
  margin: number;
}

export interface FormData {
  tobacco: SectionData;
  cigars: SectionData;
  smokingAccessories: SectionData;
  food: SectionData;
  topUps: SectionData;
  otherProducts: SectionData;
  personnel: SupplierValue[];
  fixedExpenses: {
    socialSecurity: number;
    taxes: number;
    canon: number;
  };
  rent: {
    isRented: boolean;
    price: number;
  };
  concession: {
    yearsRemaining: number;
    observations: string;
  };
  valuationSettings: {
    percentage: number;
  };
}

export interface CalculationResult {
  profitByCategory: {
    label: string;
    profit: number;
    revenue: number;
    color: string;
  }[];
  totalAnnualRevenue: number;
  totalAnnualGrossProfit: number;
  totalAnnualExpenses: number;
  totalAnnualNetProfit: number;
  estimatedValuation: number;
  yearsOfBenefit: number;
}
