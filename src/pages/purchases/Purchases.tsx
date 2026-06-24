import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Search, Trash2, Edit } from 'lucide-react';
import { getPurchases, deletePurchase, type Purchase } from '../../api/transactions';
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
import { PurchaseDialog } from '../../components/purchases/PurchaseDialog';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export default function Purchases() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [purchaseToEdit, setPurchaseToEdit] = useState<Purchase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const queryClient = useQueryClient();

  const { data: purchases, isLoading, isError } = useQuery({
    queryKey: ['purchases'],
    queryFn: getPurchases,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Purchase deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete purchase: ${error.message}`);
    }
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This purchase will be deleted and the stock will be reverted!",
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

  const filteredPurchases = purchases?.filter((purchase) => {
    const matchesSearch = purchase.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === 'All' || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'Received': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'Cancelled': return 'bg-red-500 hover:bg-red-600 text-white';
      default: return 'bg-green-500 hover:bg-green-600 text-white'; // default to Received color
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => {
            setPurchaseToEdit(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Purchase
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by supplier name..."
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
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
              <TableHead>Supplier</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
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
                  Failed to load purchases. Please try again.
                </TableCell>
              </TableRow>
            ) : !filteredPurchases || filteredPurchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No purchases found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{new Date(purchase.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{purchase.supplier?.name || 'Unknown'}</TableCell>
                  <TableCell>{purchase.product?.name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(purchase.status)} variant="outline">
                      {purchase.status || 'Received'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{purchase.quantity}</TableCell>
                  <TableCell className="text-right font-medium">৳{purchase.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setPurchaseToEdit(purchase);
                      setIsDialogOpen(true);
                    }}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(purchase.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PurchaseDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        purchaseToEdit={purchaseToEdit}
      />
    </div>
  );
}
