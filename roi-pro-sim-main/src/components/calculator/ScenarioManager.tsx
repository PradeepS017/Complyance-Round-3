import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, FolderOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CalculatorInputs, CalculatorResults } from "@/pages/Index";

interface ScenarioManagerProps {
  inputs: CalculatorInputs;
  results: CalculatorResults | null;
  onLoad: (inputs: CalculatorInputs, results: CalculatorResults | null) => void;
}

const ScenarioManager = ({ inputs, results, onLoad }: ScenarioManagerProps) => {
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);

  const handleSave = () => {
    // In production, this will save to Lovable Cloud database
    const scenario = {
      id: Date.now().toString(),
      scenario_name: inputs.scenario_name,
      inputs,
      results,
      createdAt: new Date().toISOString(),
    };

    setSavedScenarios([scenario, ...savedScenarios]);
    toast.success(`Scenario "${inputs.scenario_name}" saved!`);
  };

  const handleLoad = (scenario: any) => {
    onLoad(scenario.inputs, scenario.results);
    toast.success(`Loaded "${scenario.scenario_name}"`);
  };

  const handleDelete = (id: string, name: string) => {
    setSavedScenarios(savedScenarios.filter((s) => s.id !== id));
    toast.success(`Deleted "${name}"`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Scenarios</h3>
        <Button onClick={handleSave} disabled={!results}>
          <Save className="h-4 w-4 mr-2" />
          Save Current
        </Button>
      </div>

      {savedScenarios.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No saved scenarios yet</p>
          <p className="text-sm mt-1">Calculate and save your first scenario</p>
        </div>
      ) : (
        <div className="space-y-2">
          {savedScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{scenario.scenario_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(scenario.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoad(scenario)}
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(scenario.id, scenario.scenario_name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScenarioManager;
