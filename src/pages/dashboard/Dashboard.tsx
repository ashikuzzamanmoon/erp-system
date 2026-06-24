import { useQuery } from '@tanstack/react-query';
import { Package, Users, DollarSign, ShoppingCart, Loader2 } from 'lucide-react';
import {
  getProductsCount,
  getCustomersCount,
  getSalesRevenue,
  getPurchaseCost
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

  const { data: purchaseCost, isLoading: purchasesLoading } = useQuery({
    queryKey: ['dashboard', 'purchaseCost'],
    queryFn: getPurchaseCost,
  });

  const isLoading = productsLoading || customersLoading || salesLoading || purchasesLoading;

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
        </div>
      )}
    </div>
  );
}
