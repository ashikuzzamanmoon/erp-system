import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, Users, ShoppingCart, Loader2 } from 'lucide-react';
import { getSales } from '../../api/transactions';
import { getProducts } from '../../api/products';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  getProductsCount,
  getCustomersCount,
  getSalesRevenue,
  getPurchaseCost,
  getSuppliersCount,
  getSalesCount,
  getPurchasesCount
} from '../../api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { data: productsCount, isLoading: productsLoading } = useQuery({
    queryKey: ['dashboard', 'productsCount'],
    queryFn: getProductsCount,
  });

  const { data: customersCount, isLoading: customersLoading } = useQuery({
    queryKey: ['dashboard', 'customersCount'],
    queryFn: getCustomersCount,
  });

  const { data: salesRevenue, isLoading: salesLoading } = useQuery({
    queryKey: ['dashboard', 'salesRevenue'],
    queryFn: getSalesRevenue,
  });

  const { data: purchaseCost, isLoading: purchasesCostLoading } = useQuery({
    queryKey: ['dashboard', 'purchaseCost'],
    queryFn: getPurchaseCost,
  });

  const { data: suppliersCount, isLoading: suppliersLoading } = useQuery({
    queryKey: ['dashboard', 'suppliersCount'],
    queryFn: getSuppliersCount,
  });

  const { data: salesCount, isLoading: salesCountLoading } = useQuery({
    queryKey: ['dashboard', 'salesCount'],
    queryFn: getSalesCount,
  });

  const { data: purchasesCount, isLoading: purchasesCountLoading } = useQuery({
    queryKey: ['dashboard', 'purchasesCount'],
    queryFn: getPurchasesCount,
  });

  const { data: sales, isLoading: recentSalesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: getSales,
  });

  const { data: products, isLoading: productsDataLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const salesData = useMemo(() => {
    if (!sales) return [];
    const grouped = sales.reduce((acc: Record<string, number>, sale) => {
      const date = new Date(sale.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + sale.total_amount;
      return acc;
    }, {});

    return Object.keys(grouped)
      .map(date => ({ date, revenue: grouped[date] }))
      .reverse()
      .slice(-7);
  }, [sales]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];
  const stockData = useMemo(() => {
    if (!products) return [];
    return [...products]
      .sort((a, b) => b.stock_quantity - a.stock_quantity)
      .slice(0, 5)
      .map(p => ({ name: p.name, stock: p.stock_quantity }));
  }, [products]);

  const isLoading = productsLoading || customersLoading || salesLoading || purchasesCostLoading || suppliersLoading || salesCountLoading || purchasesCountLoading || recentSalesLoading || productsDataLoading;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              ৳
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{(salesRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground mt-1">From completed sales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{(purchaseCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground mt-1">From received purchases</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active inventory items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customersCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered clients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliersCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered vendors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchasesCount?.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Received orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Sales Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `৳${value}`}
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      cursor={{fill: '#f3f4f6'}} 
                      formatter={(value: number) => [`৳${value.toFixed(2)}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Stock Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="stock"
                    >
                      {stockData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value, 'Items in Stock']} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
      )}
    </div>
  );
}
