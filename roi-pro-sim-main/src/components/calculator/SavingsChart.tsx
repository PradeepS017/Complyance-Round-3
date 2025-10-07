import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SavingsChartProps {
  monthlySavings: number;
  timeHorizon: number;
  implementationCost: number;
}

const SavingsChart = ({ monthlySavings, timeHorizon, implementationCost }: SavingsChartProps) => {
  const data = [];
  
  for (let month = 0; month <= timeHorizon; month++) {
    const cumulative = (monthlySavings * month) - implementationCost;
    data.push({
      month,
      monthly: month === 0 ? 0 : monthlySavings,
      cumulative,
    });
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis 
          dataKey="month" 
          label={{ value: "Month", position: "insideBottom", offset: -5 }}
          className="text-xs"
        />
        <YAxis 
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          className="text-xs"
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{ 
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="monthly" 
          stroke="hsl(var(--chart-1))" 
          name="Monthly Savings"
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="cumulative" 
          stroke="hsl(var(--chart-2))" 
          name="Cumulative Savings"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SavingsChart;
