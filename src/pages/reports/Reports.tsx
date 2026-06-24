import { useQuery } from '@tanstack/react-query';
import { Download, Loader2 } from 'lucide-react';
import { getProducts } from '../../api/products';
import { getCustomers } from '../../api/customers';
import { getSuppliers } from '../../api/suppliers';
import { getSales, getPurchases } from '../../api/transactions';
import { exportToCSV } from '../../utils/export';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Reports() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: getSales,
  });

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: getPurchases,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

  const handleExportProducts = () => {
    if (!products) return;
    const exportData = products.map((p) => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      Price: p.price,
      Stock: p.stock_quantity,
      Created: new Date(p.created_at).toLocaleString(),
    }));
    exportToCSV(exportData, 'inventory_report');
  };

  const handleExportSales = () => {
    if (!sales) return;
    const exportData = sales.map((s) => ({
      ID: s.id,
      Customer: s.customer?.name || 'Walk-in',
      Product: s.product?.name || 'Unknown',
      Quantity: s.quantity,
      TotalAmount: s.total_amount,
      Status: s.status || 'Completed',
      Date: new Date(s.created_at).toLocaleString(),
    }));
    exportToCSV(exportData, 'sales_report');
  };

  const handleExportPurchases = () => {
    if (!purchases) return;
    const exportData = purchases.map((p) => ({
      ID: p.id,
      Supplier: p.supplier?.name || 'Unknown',
      Product: p.product?.name || 'Unknown',
      Quantity: p.quantity,
      TotalAmount: p.total_amount,
      Status: p.status || 'Received',
      Date: new Date(p.created_at).toLocaleString(),
    }));
    exportToCSV(exportData, 'purchases_report');
  };

  const handleExportCustomers = () => {
    if (!customers) return;
    const exportData = customers.map((c) => ({
      ID: c.id,
      Name: c.name,
      Email: c.email || 'N/A',
      Phone: c.phone || 'N/A',
      Address: c.address || 'N/A',
      Registered: new Date(c.created_at).toLocaleString(),
    }));
    exportToCSV(exportData, 'customers_report');
  };

  const handleExportSuppliers = () => {
    if (!suppliers) return;
    const exportData = suppliers.map((s) => ({
      ID: s.id,
      Name: s.name,
      ContactPerson: s.contact_person || 'N/A',
      Email: s.email || 'N/A',
      Phone: s.phone || 'N/A',
      Address: s.address || 'N/A',
      Registered: new Date(s.created_at).toLocaleString(),
    }));
    exportToCSV(exportData, 'suppliers_report');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
      </div>

      <Tabs defaultValue="inventory" className="w-full space-y-4">
        <TabsList className="flex w-full justify-start overflow-x-auto flex-nowrap scrollbar-hide">
          <TabsTrigger value="inventory" className="whitespace-nowrap">Inventory Report</TabsTrigger>
          <TabsTrigger value="sales" className="whitespace-nowrap">Sales Report</TabsTrigger>
          <TabsTrigger value="purchases" className="whitespace-nowrap">Purchase Report</TabsTrigger>
          <TabsTrigger value="customers" className="whitespace-nowrap">Customer Report</TabsTrigger>
          <TabsTrigger value="suppliers" className="whitespace-nowrap">Supplier Report</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Inventory Overview</h3>
            <Button onClick={handleExportProducts} variant="outline" disabled={productsLoading || !products?.length}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="text-right">৳{product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold">{product.stock_quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Sales History</h3>
            <Button onClick={handleExportSales} variant="outline" disabled={salesLoading || !sales?.length}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : sales?.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.customer?.name || 'Walk-in'}</TableCell>
                    <TableCell>{sale.product?.name || 'Unknown'}</TableCell>
                    <TableCell>{sale.status || 'Completed'}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">৳{sale.total_amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Purchase History</h3>
            <Button onClick={handleExportPurchases} variant="outline" disabled={purchasesLoading || !purchases?.length}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchasesLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : purchases?.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{purchase.supplier?.name || 'Unknown'}</TableCell>
                    <TableCell>{purchase.product?.name || 'Unknown'}</TableCell>
                    <TableCell>{purchase.status || 'Received'}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">৳{purchase.total_amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Customer List</h3>
            <Button onClick={handleExportCustomers} variant="outline" disabled={customersLoading || !customers?.length}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customersLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : customers?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email || 'N/A'}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Supplier List</h3>
            <Button onClick={handleExportSuppliers} variant="outline" disabled={suppliersLoading || !suppliers?.length}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliersLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : suppliers?.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact_person || 'N/A'}</TableCell>
                    <TableCell>{supplier.email || 'N/A'}</TableCell>
                    <TableCell>{supplier.phone || 'N/A'}</TableCell>
                    <TableCell>{new Date(supplier.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
