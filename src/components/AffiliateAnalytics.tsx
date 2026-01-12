import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Percent } from "lucide-react";

interface AffiliateOrder {
  id: string;
  order_amount: number;
  commission_amount: number;
  commission_paid: boolean;
  created_at: string;
}

interface AffiliateAnalyticsProps {
  orders: AffiliateOrder[];
  totalEarnings: number;
  totalReferrals: number;
  commissionRate: number;
}

const AffiliateAnalytics = ({ orders, totalEarnings, totalReferrals, commissionRate }: AffiliateAnalyticsProps) => {
  const [referralData, setReferralData] = useState<{ date: string; referrals: number; earnings: number }[]>([]);
  const [conversionData, setConversionData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    if (orders.length > 0) {
      // Process last 30 days of data
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const dailyData = last30Days.map(date => {
        const dayOrders = orders.filter(o => o.created_at.startsWith(date));
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          referrals: dayOrders.length,
          earnings: dayOrders.reduce((sum, o) => sum + o.commission_amount, 0)
        };
      });

      setReferralData(dailyData);

      // Calculate conversion metrics
      const paidOrders = orders.filter(o => o.commission_paid).length;
      const pendingOrders = orders.length - paidOrders;
      
      setConversionData([
        { name: 'Paid', value: paidOrders, color: 'hsl(var(--chart-1))' },
        { name: 'Pending', value: pendingOrders, color: 'hsl(var(--chart-2))' }
      ]);
    }
  }, [orders]);

  const chartConfig = {
    referrals: {
      label: "Referrals",
      color: "hsl(var(--chart-1))"
    },
    earnings: {
      label: "Earnings",
      color: "hsl(var(--chart-2))"
    }
  };

  // Calculate stats
  const avgOrderValue = orders.length > 0 
    ? orders.reduce((sum, o) => sum + o.order_amount, 0) / orders.length 
    : 0;
  const avgCommission = orders.length > 0 
    ? orders.reduce((sum, o) => sum + o.commission_amount, 0) / orders.length 
    : 0;
  const conversionRate = totalReferrals > 0 
    ? ((orders.length / totalReferrals) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{avgOrderValue.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Commission</p>
                <p className="text-2xl font-bold">₹{avgCommission.toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Percent className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Referrals Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Referrals Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={referralData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="referrals" 
                  stroke="var(--color-referrals)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Earnings Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={referralData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="earnings" 
                  fill="var(--color-earnings)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Commission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Commission Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8">
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {conversionData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateAnalytics;
