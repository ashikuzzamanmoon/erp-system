import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPurchase, updatePurchase, type Purchase } from '../../api/transactions';
import { getSuppliers } from '../../api/suppliers';
import { getProducts } from '../../api/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const purchaseSchema = z.object({
  supplier_id: z.string().min(1, 'Supplier is required'),
  product_id: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  total_amount: z.coerce.number().min(0.01, 'Total amount must be greater than 0'),
  status: z.string().default('Received'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseToEdit?: Purchase | null;
}

export function PurchaseDialog({ isOpen, onClose, purchaseToEdit }: PurchaseDialogProps) {
  const queryClient = useQueryClient();

  const { data: suppliers } = useQuery({ queryKey: ['suppliers'], queryFn: getSuppliers });
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema) as any,
    defaultValues: {
      supplier_id: '',
      product_id: '',
      quantity: 1,
      total_amount: 0,
      status: 'Received',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (purchaseToEdit) {
        reset({
          supplier_id: purchaseToEdit.supplier_id,
          product_id: purchaseToEdit.product_id,
          quantity: purchaseToEdit.quantity,
          total_amount: purchaseToEdit.total_amount,
          status: purchaseToEdit.status || 'Received',
        });
      } else {
        reset({
          supplier_id: '',
          product_id: '',
          quantity: 1,
          total_amount: 0,
          status: 'Received',
        });
      }
    }
  }, [isOpen, purchaseToEdit, reset]);

  const mutation = useMutation({
    mutationFn: async (data: PurchaseFormData) => {
      if (purchaseToEdit) {
        return updatePurchase(purchaseToEdit.id, data);
      }
      return createPurchase(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success(`Purchase ${purchaseToEdit ? 'updated' : 'recorded'} successfully`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to ${purchaseToEdit ? 'update' : 'record'} purchase: ${error.message}`);
    },
  });

  const onSubmit = (data: PurchaseFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{purchaseToEdit ? 'Edit Purchase' : 'Add New Purchase'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <Label htmlFor="supplier_id">Supplier <span className="text-destructive">*</span></Label>
            <Select value={watch('supplier_id')} onValueChange={(value) => setValue('supplier_id', value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers?.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.supplier_id && <p className="text-sm text-destructive">{errors.supplier_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_id">Product <span className="text-destructive">*</span></Label>
            <Select value={watch('product_id')} onValueChange={(value) => setValue('product_id', value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product_id && <p className="text-sm text-destructive">{errors.product_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity <span className="text-destructive">*</span></Label>
              <Input id="quantity" type="number" min="1" {...register('quantity')} />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Amount (৳) <span className="text-destructive">*</span></Label>
              <Input id="total_amount" type="number" step="0.01" min="0" {...register('total_amount')} />
              {errors.total_amount && <p className="text-sm text-destructive">{errors.total_amount.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={watch('status')} onValueChange={(value) => setValue('status', value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : purchaseToEdit ? 'Update Purchase' : 'Save Purchase'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
