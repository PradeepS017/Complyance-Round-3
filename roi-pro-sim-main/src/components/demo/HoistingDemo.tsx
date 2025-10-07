/**
 * HOISTING DEMO
 * 
 * JavaScript hoisting is a behavior where variable and function declarations are moved 
 * to the top of their scope during compilation, before code execution.
 * 
 * SAFE PATTERNS FOR REACT:
 * 1. Always use `const` or `let` instead of `var` (block-scoped, not hoisted the same way)
 * 2. Declare functions before usage or use const with arrow functions
 * 3. Declare all variables at the top of their scope for clarity
 * 4. React hooks rely on consistent ordering - never conditionally call hooks
 * 
 * MDN Reference: https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
 */

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code2, CheckCircle2, XCircle } from "lucide-react";

const HoistingDemo = () => {
  // DEMONSTRATION 1: var vs let/const hoisting
  const demonstrateVarHoisting = () => {
    console.log("=== VAR HOISTING DEMO ===");
    
    // This works (but is undefined) because var is hoisted
    console.log("varExample before declaration:", typeof varExample); // "undefined"
    var varExample = "I'm hoisted!";
    console.log("varExample after declaration:", varExample); // "I'm hoisted!"
    
    // This would throw ReferenceError if uncommented
    // console.log(letExample); // ReferenceError: Cannot access before initialization
    let letExample = "I'm not hoisted the same way!";
    console.log("letExample:", letExample);
  };

  // DEMONSTRATION 2: Function hoisting
  const demonstrateFunctionHoisting = () => {
    console.log("=== FUNCTION HOISTING DEMO ===");
    
    // Function declarations ARE hoisted - this works!
    console.log("hoistedFunction result:", hoistedFunction()); // "I work before declaration!"
    
    function hoistedFunction() {
      return "I work before declaration!";
    }
    
    // Arrow functions stored in const are NOT hoisted this way
    // This would throw TypeError if called before declaration
    const notHoistedFunction = () => {
      return "I must be declared first!";
    };
    console.log("notHoistedFunction result:", notHoistedFunction());
  };

  // DEMONSTRATION 3: React-safe pattern
  const demonstrateReactSafePattern = () => {
    console.log("=== REACT SAFE PATTERN ===");
    
    // ✅ GOOD: Declare at the top with const
    const safeValue = "Declared before use";
    
    // ✅ GOOD: Arrow function with const
    const safeFunction = (msg: string) => {
      return `Safe: ${msg}`;
    };
    
    console.log("safeValue:", safeValue);
    console.log("safeFunction:", safeFunction("This is the React way!"));
  };

  return (
    <Card className="p-6 bg-accent border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Code2 className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">JavaScript Hoisting Demo</h3>
      </div>

      <Alert className="mb-4 bg-primary/10 border-primary/30">
        <AlertDescription className="text-sm">
          <strong>What is Hoisting?</strong> JavaScript moves variable and function declarations 
          to the top of their scope during compilation. This demo shows safe patterns for React.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-start gap-2 mb-2">
            <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">❌ Avoid in React</h4>
              <pre className="text-xs bg-secondary p-2 rounded overflow-x-auto">
{`// BAD: var is hoisted (use const/let instead)
console.log(myVar); // undefined (hoisted)
var myVar = "surprise!";

// BAD: Using before declaration
hoistedFunc(); // Works but confusing
function hoistedFunc() { return "hoisted"; }`}
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground mb-1">✅ React-Safe Pattern</h4>
              <pre className="text-xs bg-secondary p-2 rounded overflow-x-auto">
{`// GOOD: Declare with const/let at top
const myValue = "clear and safe";
let mutableValue = 0;

// GOOD: Arrow function in const
const myFunction = () => {
  return "Safe React pattern";
};

// GOOD: Use after declaration
console.log(myValue);
myFunction();`}
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-2">Try It Yourself</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Open your browser console to see the hoisting demonstrations.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={demonstrateVarHoisting}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            >
              Run var Demo
            </button>
            <button
              onClick={demonstrateFunctionHoisting}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
            >
              Run Function Demo
            </button>
            <button
              onClick={demonstrateReactSafePattern}
              className="px-3 py-1 bg-success text-success-foreground rounded text-sm hover:bg-success/90 transition-colors"
            >
              Run Safe Pattern
            </button>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Key Takeaway:</strong> In React components, always declare variables with 
            const/let at the top of your component or function, and use arrow functions stored 
            in const. This prevents hoisting confusion and aligns with React best practices.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};

export default HoistingDemo;
