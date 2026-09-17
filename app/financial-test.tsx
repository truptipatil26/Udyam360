import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { calculateLoan, LoanResponse } from "../src/services/financialApi";

export default function FinancialTest() {
  const [result, setResult] = useState<LoanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testLoan = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await calculateLoan({
        loan_amount: 200000,
        annual_interest_rate: 10,
        tenure_years: 5,
        monthly_revenue: 60000,
        monthly_expenses: 40000,
      });

      setResult(response);
    } catch (err) {
      console.log(err);
      setError("Could not connect to financial backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Backend Test</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={testLoan}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Calculate Loan</Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result && (
        <View style={styles.result}>
          <Text>Loan Amount: ₹{result.loan_amount}</Text>

          <Text style={styles.emi}>
            Monthly EMI: ₹{result.monthly_emi.toFixed(2)}
          </Text>

          <Text>
            Total Repayment: ₹{result.total_repayment.toFixed(2)}
          </Text>

          <Text>
            Total Interest: ₹{result.total_interest.toFixed(2)}
          </Text>

          <Text>
            Monthly Profit: ₹
            {result.monthly_profit_before_emi.toFixed(2)}
          </Text>

          <Text>
            Cash Surplus: ₹
            {result.monthly_cash_surplus_after_emi.toFixed(2)}
          </Text>

          <Text style={styles.status}>
            Financially Acceptable:{" "}
            {result.financially_acceptable ? "Yes" : "No"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#2E7D32",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  result: {
    marginTop: 25,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    gap: 10,
  },

  emi: {
    fontSize: 20,
    fontWeight: "700",
  },

  status: {
    marginTop: 10,
    fontWeight: "700",
  },

  error: {
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
});