import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, Percent, BarChart3 } from "lucide-react";
import type { CalculatorInputs, CalculatorResults } from "@/pages/Index";
import SavingsChart from "./SavingsChart";

interface ResultsPanelProps {
  results: CalculatorResults | null;
  inputs: CalculatorInputs;
}

const ResultsPanel = ({ results, inputs }: ResultsPanelProps) => {
  if (!results) {
    return (
      <Card className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Enter your data and click Calculate to see results</p>
        </div>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-primary text-primary-foreground">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-medium opacity-90">Net Savings</h3>
          <DollarSign className="h-6 w-6 opacity-90" />
        </div>
        <p className="text-4xl font-bold">{formatCurrency(results.net_savings)}</p>
        <p className="text-sm opacity-80 mt-2">Over {inputs.time_horizon_months} months</p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">Monthly Savings</h4>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(results.monthly_savings)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">Payback Period</h4>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {results.payback_months.toFixed(1)} mo
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-medium text-muted-foreground">ROI Percentage</h4>
          <Percent className="h-4 w-4 text-primary" />
        </div>
        <p className="text-3xl font-bold text-success">
          {formatPercent(results.roi_percentage)}
        </p>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 text-foreground">Cost Breakdown</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Manual Labor Cost</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(results.breakdown.labor_cost_manual)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Error Savings</span>
            <span className="font-semibold text-success">
              +{formatCurrency(results.breakdown.error_savings)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Automation Cost</span>
            <span className="font-semibold text-destructive">
              -{formatCurrency(results.breakdown.auto_cost)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold text-foreground">Monthly Net Savings</span>
            <span className="font-bold text-primary">
              {formatCurrency(results.monthly_savings)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4 text-foreground">Savings Over Time</h4>
        <SavingsChart
          monthlySavings={results.monthly_savings}
          timeHorizon={inputs.time_horizon_months}
          implementationCost={inputs.one_time_implementation_cost}
        />
      </Card>
    </div>
  );
};

export default ResultsPanel;
