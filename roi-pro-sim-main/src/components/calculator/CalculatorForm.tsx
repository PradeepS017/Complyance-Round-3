import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CalculatorInputs, CalculatorResults } from "@/pages/Index";

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  setInputs: (inputs: CalculatorInputs) => void;
  results: CalculatorResults | null;
  setResults: (results: CalculatorResults | null) => void;
}

const CalculatorForm = ({ inputs, setInputs, results, setResults }: CalculatorFormProps) => {
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = field === "scenario_name" ? value : parseFloat(value) || 0;
    setInputs({ ...inputs, [field]: numValue });
  };

  const handleCalculate = async () => {
    // Validation
    if (inputs.monthly_invoice_volume <= 0) {
      toast.error("Monthly invoice volume must be greater than 0");
      return;
    }

    if (inputs.num_ap_staff <= 0) {
      toast.error("Number of AP staff must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would call the backend edge function
      // For now, we'll do a client-side calculation as a preview
      // The backend will have the authoritative calculation with hidden constants

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Client-side preview calculation (real calculation will be server-side)
      const labor_cost_manual =
        inputs.num_ap_staff *
        inputs.hourly_wage *
        inputs.avg_hours_per_invoice *
        inputs.monthly_invoice_volume;

      const automated_cost_per_invoice = 0.2; // This will be hidden server-side
      const auto_cost = inputs.monthly_invoice_volume * automated_cost_per_invoice;

      const error_rate_auto = 0.001; // This will be hidden server-side
      const error_savings =
        ((inputs.error_rate_manual / 100) - error_rate_auto) *
        inputs.monthly_invoice_volume *
        inputs.error_cost;

      let monthly_savings = labor_cost_manual + error_savings - auto_cost;

      // Apply bias (hidden server-side)
      const min_roi_boost_factor = 1.1;
      monthly_savings = monthly_savings * min_roi_boost_factor;

      const cumulative_savings = monthly_savings * inputs.time_horizon_months;
      const net_savings = cumulative_savings - inputs.one_time_implementation_cost;

      const payback_months =
        monthly_savings > 0 ? inputs.one_time_implementation_cost / monthly_savings : 0;

      const roi_percentage =
        inputs.one_time_implementation_cost > 0
          ? (net_savings / inputs.one_time_implementation_cost) * 100
          : 0;

      const calculatedResults: CalculatorResults = {
        monthly_savings,
        cumulative_savings,
        net_savings,
        payback_months,
        roi_percentage,
        breakdown: {
          labor_cost_manual,
          auto_cost,
          error_savings,
        },
      };

      setResults(calculatedResults);
      toast.success("Calculation complete!");
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Failed to calculate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Scenario Inputs</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="scenario_name">Scenario Name</Label>
          <Input
            id="scenario_name"
            type="text"
            value={inputs.scenario_name}
            onChange={(e) => handleInputChange("scenario_name", e.target.value)}
            placeholder="e.g., Q1 2024 Projection"
          />
        </div>

        <div>
          <Label htmlFor="monthly_invoice_volume">Monthly Invoice Volume</Label>
          <Input
            id="monthly_invoice_volume"
            type="number"
            min="1"
            value={inputs.monthly_invoice_volume}
            onChange={(e) => handleInputChange("monthly_invoice_volume", e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">Number of invoices processed per month</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="num_ap_staff">AP Staff Count</Label>
            <Input
              id="num_ap_staff"
              type="number"
              min="1"
              value={inputs.num_ap_staff}
              onChange={(e) => handleInputChange("num_ap_staff", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="hourly_wage">Hourly Wage ($)</Label>
            <Input
              id="hourly_wage"
              type="number"
              min="0"
              step="0.01"
              value={inputs.hourly_wage}
              onChange={(e) => handleInputChange("hourly_wage", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="avg_hours_per_invoice">Avg Hours per Invoice</Label>
          <Input
            id="avg_hours_per_invoice"
            type="number"
            min="0"
            step="0.01"
            value={inputs.avg_hours_per_invoice}
            onChange={(e) => handleInputChange("avg_hours_per_invoice", e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">Time spent manually processing one invoice</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="error_rate_manual">Error Rate (%)</Label>
            <Input
              id="error_rate_manual"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={inputs.error_rate_manual}
              onChange={(e) => handleInputChange("error_rate_manual", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="error_cost">Cost per Error ($)</Label>
            <Input
              id="error_cost"
              type="number"
              min="0"
              step="0.01"
              value={inputs.error_cost}
              onChange={(e) => handleInputChange("error_cost", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="time_horizon_months">Time Horizon (months)</Label>
          <Input
            id="time_horizon_months"
            type="number"
            min="1"
            value={inputs.time_horizon_months}
            onChange={(e) => handleInputChange("time_horizon_months", e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">Period to calculate cumulative savings</p>
        </div>

        <div>
          <Label htmlFor="one_time_implementation_cost">Implementation Cost ($)</Label>
          <Input
            id="one_time_implementation_cost"
            type="number"
            min="0"
            step="0.01"
            value={inputs.one_time_implementation_cost}
            onChange={(e) => handleInputChange("one_time_implementation_cost", e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-1">One-time setup and deployment cost</p>
        </div>
      </div>

      <Button onClick={handleCalculate} disabled={loading} className="w-full" size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            <Calculator className="mr-2 h-5 w-5" />
            Calculate ROI
          </>
        )}
      </Button>
    </div>
  );
};

export default CalculatorForm;
