const API_BASE_URL = "http://10.64.204.216:8000";

export type LoanRequest = {
  loan_amount: number;
  annual_interest_rate: number;
  tenure_years: number;
  monthly_revenue: number;
  monthly_expenses: number;
};

export type LoanResponse = {
  loan_amount: number;
  annual_interest_rate: number;
  tenure_years: number;
  monthly_emi: number;
  total_repayment: number;
  total_interest: number;
  monthly_profit_before_emi: number;
  monthly_cash_surplus_after_emi: number;
  financially_acceptable: boolean;
  warnings: string[];
};

export async function calculateLoan(
  data: LoanRequest
): Promise<LoanResponse> {
  const response = await fetch(
    `${API_BASE_URL}/calculate-loan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Financial API error: ${response.status}`
    );
  }

  return await response.json();
}