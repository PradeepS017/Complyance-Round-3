import { useState } from "react";
import CalculatorForm from "@/components/calculator/CalculatorForm";
import ResultsPanel from "@/components/calculator/ResultsPanel";
import ScenarioManager from "@/components/calculator/ScenarioManager";
import ReportGenerator from "@/components/calculator/ReportGenerator";
import HoistingDemo from "@/components/demo/HoistingDemo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Code2 } from "lucide-react";

export interface CalculatorInputs {
  scenario_name: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost: number;
}

export interface CalculatorResults {
  monthly_savings: number;
  cumulative_savings: number;
  net_savings: number;
  payback_months: number;
  roi_percentage: number;
  breakdown: {
    labor_cost_manual: number;
    auto_cost: number;
    error_savings: number;
  };
}

const Index = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    scenario_name: "My Scenario",
    monthly_invoice_volume: 1000,
    num_ap_staff: 3,
    avg_hours_per_invoice: 0.5,
    hourly_wage: 25,
    error_rate_manual: 5,
    error_cost: 50,
    time_horizon_months: 12,
    one_time_implementation_cost: 10000,
  });

  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                Invoice Automation ROI Calculator
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDemo(!showDemo)}
            >
              <Code2 className="h-4 w-4 mr-2" />
              {showDemo ? "Hide" : "Show"} Hoisting Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hoisting Demo */}
      {showDemo && (
        <div className="container mx-auto px-4 py-4">
          <HoistingDemo />
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg text-muted-foreground max-w-3xl">
            Calculate the ROI of automating your invoice processing. Enter your current AP metrics
            to see potential savings, payback period, and long-term benefits.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            <Card className="p-6">
              <CalculatorForm
                inputs={inputs}
                setInputs={setInputs}
                results={results}
                setResults={setResults}
              />
            </Card>

            <Card className="p-6">
              <ScenarioManager
                inputs={inputs}
                results={results}
                onLoad={(loadedInputs, loadedResults) => {
                  setInputs(loadedInputs);
                  setResults(loadedResults);
                }}
              />
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            <ResultsPanel results={results} inputs={inputs} />

            {results && (
              <Card className="p-6">
                <ReportGenerator inputs={inputs} results={results} />
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
