import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { calculateLoan, LoanResponse } from "../src/services/financialApi";

export default function FinancialStructuringScreen() {
  const router = useRouter();

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  const [result, setResult] = useState<LoanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const formatMoney = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleCalculate = async () => {
    const loan = Number(loanAmount);
    const rate = Number(interestRate);
    const years = Number(tenure);
    const revenue = Number(monthlyRevenue);
    const expenses = Number(monthlyExpenses);

    if (
      !loanAmount ||
      !interestRate ||
      !tenure ||
      !monthlyRevenue ||
      !monthlyExpenses
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (
      !Number.isFinite(loan) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(years) ||
      !Number.isFinite(revenue) ||
      !Number.isFinite(expenses)
    ) {
      Alert.alert("Invalid Input", "Please enter valid numbers.");
      return;
    }

    if (loan <= 0 || rate < 0 || years <= 0 || revenue < 0 || expenses < 0) {
      Alert.alert(
        "Invalid Input",
        "Please enter positive and valid financial values."
      );
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await calculateLoan({
        loan_amount: loan,
        annual_interest_rate: rate,
        tenure_years: years,
        monthly_revenue: revenue,
        monthly_expenses: expenses,
      });

      setResult(response);
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Unable to connect to the financial calculator. Make sure your FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Financial Structuring</Text>
            <Text style={styles.subtitle}>
              Plan your business financing
            </Text>
          </View>
        </View>
        <View style={styles.sectionHeader}>
  <Ionicons name="calculator-outline" size={22} color="#2E7D32" />

  <View style={{ flex: 1 }}>
    <Text style={styles.sectionTitle}>Financial Planning</Text>

    <Text style={styles.sectionSubtitle}>
      Enter your business and loan details to check affordability.
    </Text>
  </View>
</View>
        {/* Input Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Business & Loan Details</Text>

          <Text style={styles.label}>Loan Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={loanAmount}
            onChangeText={setLoanAmount}
            placeholder="e.g. 200000"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Annual Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="e.g. 10"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Loan Tenure (Years)</Text>
          <TextInput
            style={styles.input}
            value={tenure}
            onChangeText={setTenure}
            placeholder="e.g. 5"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Monthly Revenue (₹)</Text>
          <TextInput
            style={styles.input}
            value={monthlyRevenue}
            onChangeText={setMonthlyRevenue}
            placeholder="e.g. 60000"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Monthly Expenses (₹)</Text>
          <TextInput
            style={styles.input}
            value={monthlyExpenses}
            onChangeText={setMonthlyExpenses}
            placeholder="e.g. 40000"
            keyboardType="numeric"
          />

          {/* Calculate Button */}
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="calculator-outline" size={20} color="#fff" />
                <Text style={styles.calculateText}>
                  Calculate Financial Plan
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Financial Plan</Text>

{/* Loan Summary */}
<View style={styles.summaryCard}>
  <Text style={styles.summaryTitle}>Loan Summary</Text>

  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>Loan Amount</Text>
    <Text style={styles.summaryValue}>
      {formatMoney(result.loan_amount)}
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>Interest Rate</Text>
    <Text style={styles.summaryValue}>
      {result.annual_interest_rate}%
    </Text>
  </View>

  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>Loan Tenure</Text>
    <Text style={styles.summaryValue}>
      {result.tenure_years} years
    </Text>
  </View>
</View>

<View style={styles.resultGrid}>
              <View style={styles.resultCard}>
                <Ionicons
                  name="cash-outline"
                  size={25}
                  color="#2E7D32"
                />
                <Text style={styles.resultLabel}>Monthly EMI</Text>
                <Text style={styles.resultValue}>
                  {formatMoney(result.monthly_emi)}
                </Text>
              </View>

              <View style={styles.resultCard}>
                <Ionicons
                  name="wallet-outline"
                  size={25}
                  color="#2E7D32"
                />
                <Text style={styles.resultLabel}>Total Repayment</Text>
                <Text style={styles.resultValue}>
                  {formatMoney(result.total_repayment)}
                </Text>
              </View>

              <View style={styles.resultCard}>
                <Ionicons
                  name="trending-up-outline"
                  size={25}
                  color="#2E7D32"
                />
                <Text style={styles.resultLabel}>Total Interest</Text>
                <Text style={styles.resultValue}>
                  {formatMoney(result.total_interest)}
                </Text>
              </View>

              <View style={styles.resultCard}>
                <Ionicons
                  name="stats-chart-outline"
                  size={25}
                  color="#2E7D32"
                />
                <Text style={styles.resultLabel}>Monthly Profit</Text>
                <Text style={styles.resultValue}>
                  {formatMoney(result.monthly_profit_before_emi)}
                </Text>
              </View>
            </View>

            {/* Cash Surplus */}
            <View style={styles.surplusCard}>
              <Text style={styles.surplusLabel}>
                Monthly Cash Surplus After EMI
              </Text>

              <Text style={styles.surplusValue}>
                {formatMoney(result.monthly_cash_surplus_after_emi)}
              </Text>
            </View>

            {/* Financial Status */}
            <View
              style={[
                styles.statusCard,
                result.financially_acceptable
                  ? styles.statusAcceptable
                  : styles.statusWarning,
              ]}
            >
              <Ionicons
                name={
                  result.financially_acceptable
                    ? "checkmark-circle"
                    : "warning"
                }
                size={28}
                color={
                  result.financially_acceptable ? "#2E7D32" : "#C62828"
                }
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>
                  {result.financially_acceptable
                    ? "Financially Acceptable"
                    : "Financial Attention Required"}
                </Text>

                <Text style={styles.statusText}>
                  {result.financially_acceptable
                    ? "The proposal passes the current financial rules."
                    : "The proposal does not pass the current financial rules."}
                </Text>
              </View>
            </View>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningTitle}>Notes</Text>

                {result.warnings.map((warning, index) => (
                  <View key={index} style={styles.warningRow}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.warningText}>{warning}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    summaryCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 16,
  marginBottom: 14,
  elevation: 1,
  shadowOpacity: 0.06,
  shadowRadius: 4,
  shadowOffset: {
    width: 0,
    height: 2,
  },
},

summaryTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#222",
  marginBottom: 12,
},

summaryRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 8,
},

summaryLabel: {
  fontSize: 14,
  color: "#6B6B6B",
},

summaryValue: {
  fontSize: 14,
  fontWeight: "700",
  color: "#222",
},

    sectionHeader: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F1F8E9",
  padding: 16,
  borderRadius: 14,
  marginBottom: 20,
},

sectionTitle: {
  fontSize: 17,
  fontWeight: "700",
  color: "#1B5E20",
  marginLeft: 12,
  marginBottom: 3,
},

sectionSubtitle: {
  fontSize: 13,
  color: "#666",
  marginLeft: 12,
  lineHeight: 18,
},
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    marginTop: 3,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D9DED9",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#FAFCFA",
    marginBottom: 16,
  },

  calculateButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  calculateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  resultsContainer: {
    marginTop: 2,
  },

  resultsTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#222",
    marginBottom: 14,
  },

  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  resultCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  resultLabel: {
    fontSize: 13,
    color: "#6B6B6B",
    marginTop: 9,
  },

  resultValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginTop: 4,
  },

  surplusCard: {
    backgroundColor: "#EAF5EA",
    borderRadius: 16,
    padding: 18,
    marginTop: 2,
    marginBottom: 14,
  },

  surplusLabel: {
    fontSize: 14,
    color: "#456345",
    fontWeight: "600",
  },

  surplusValue: {
    fontSize: 25,
    fontWeight: "800",
    color: "#2E7D32",
    marginTop: 5,
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    gap: 12,
  },

  statusAcceptable: {
    backgroundColor: "#EAF5EA",
  },

  statusWarning: {
    backgroundColor: "#FDECEC",
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  statusText: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },

  warningBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },

  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },

  warningRow: {
    flexDirection: "row",
    marginBottom: 7,
  },

  bullet: {
    fontSize: 16,
    marginRight: 8,
    color: "#555",
  },

  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#555",
  },
});