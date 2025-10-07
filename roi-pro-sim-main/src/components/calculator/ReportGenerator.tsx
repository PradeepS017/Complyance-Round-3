import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import type { CalculatorInputs, CalculatorResults } from "@/pages/Index";

interface ReportGeneratorProps {
  inputs: CalculatorInputs;
  results: CalculatorResults;
}

const ReportGenerator = ({ inputs, results }: ReportGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // In production, this will call the Lovable Cloud edge function
      // which will save the lead and generate/email the PDF report
      
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(`Report sent to ${email}!`);
      setOpen(false);
      setEmail("");
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">Generate Report</h3>
        <p className="text-sm text-muted-foreground">
          Get a detailed PDF report with your ROI analysis and recommendations.
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <FileText className="h-5 w-5 mr-2" />
            Generate PDF Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate ROI Report</DialogTitle>
            <DialogDescription>
              Enter your email to receive a comprehensive PDF report with your ROI calculations
              and analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-foreground">Report Includes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete ROI analysis</li>
                <li>• Cost breakdown and savings timeline</li>
                <li>• Visual charts and projections</li>
                <li>• Implementation recommendations</li>
              </ul>
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Send Report
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportGenerator;
