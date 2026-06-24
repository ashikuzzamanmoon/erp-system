import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Printer, Search, Trash2, Edit } from 'lucide-react';
import { getSales, deleteSale, type Sale } from '../../api/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SaleDialog } from '../../components/sales/SaleDialog';
import { InvoicePrintable } from '../../components/sales/InvoicePrintable';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Sales() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState<Sale | null>(null);
  const [printingSale, setPrintingSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const queryClient = useQueryClient();

  const { data: sales, isLoading, isError } = useQuery({
    queryKey: ['sales'],
    queryFn: getSales,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Sale deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete sale: ${error.message}`);
    }
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This sale will be deleted and the stock will be reverted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handlePrint = (sale: Sale) => {
    setPrintingSale(sale);
    // Give state time to update the DOM before triggering print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredSales = sales?.filter((sale) => {
    const customerName = sale.customer?.name || 'Walk-in';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'Completed': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'Cancelled': return 'bg-red-500 hover:bg-red-600 text-white';
      default: return 'bg-green-500 hover:bg-green-600 text-white';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 relative">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => {
            setSaleToEdit(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by customer name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-destructive">
                  Failed to load sales. Please try again.
                </TableCell>
              </TableRow>
            ) : !filteredSales || filteredSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No sales found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{sale.customer?.name || 'Walk-in'}</TableCell>
                  <TableCell>{sale.product?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sale.status)} variant="outline">
                      {sale.status || 'Completed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{sale.quantity}</TableCell>
                  <TableCell className="text-right font-medium">৳{sale.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-slate-900"
                        onClick={() => handlePrint(sale)}
                        title="Print Invoice"
                      >
                        <Printer className="h-4 w-4" />
                        <span className="sr-only">Print Invoice</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSaleToEdit(sale);
                        setIsDialogOpen(true);
                      }}>
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SaleDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        saleToEdit={saleToEdit}
      />

      {/* Hidden printable invoice that only shows up when window.print() is called */}
      <InvoicePrintable sale={printingSale} />
    </div>
  );
}
