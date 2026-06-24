import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSale, updateSale, type Sale } from '../../api/transactions';
import { getCustomers } from '../../api/customers';
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

const saleSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  product_id: z.string().min(1, 'Product is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  total_amount: z.coerce.number().min(0.01, 'Total amount must be greater than 0'),
  status: z.string().default('Completed'),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  saleToEdit?: Sale | null;
}

export function SaleDialog({ isOpen, onClose, saleToEdit }: SaleDialogProps) {
  const queryClient = useQueryClient();

  const { data: customers } = useQuery({ queryKey: ['customers'], queryFn: getCustomers });
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: getProducts });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema) as any,
    defaultValues: {
      customer_id: '',
      product_id: '',
      quantity: 1,
      total_amount: 0,
      status: 'Completed',
    },
  });

  const watchProductId = useWatch({ control, name: 'product_id' });
  const watchQuantity = useWatch({ control, name: 'quantity' });

  useEffect(() => {
    if (isOpen) {
      if (saleToEdit) {
        reset({
          customer_id: saleToEdit.customer_id,
          product_id: saleToEdit.product_id,
          quantity: saleToEdit.quantity,
          total_amount: saleToEdit.total_amount,
          status: saleToEdit.status || 'Completed',
        });
      } else {
        reset({ customer_id: '', product_id: '', quantity: 1, total_amount: 0, status: 'Completed' });
      }
    }
  }, [isOpen, saleToEdit, reset]);

  // Smart Feature: Auto-calculate Total Amount based on Product Price and Quantity
  useEffect(() => {
    if (watchProductId && watchQuantity && products) {
      const selectedProduct = products.find(p => p.id === watchProductId);
      if (selectedProduct && selectedProduct.price) {
        const calculatedTotal = selectedProduct.price * watchQuantity;
        setValue('total_amount', Number(calculatedTotal.toFixed(2)), { shouldValidate: true });
      }
    }
  }, [watchProductId, watchQuantity, products, setValue]);

  const mutation = useMutation({
    mutationFn: async (data: SaleFormData) => {
      if (saleToEdit) {
        return updateSale(saleToEdit.id, data);
      }
      return createSale(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success(`Sale ${saleToEdit ? 'updated' : 'recorded'} successfully`);
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to ${saleToEdit ? 'update' : 'record'} sale: ${error.message}`);
    },
  });

  const onSubmit = (data: SaleFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{saleToEdit ? 'Edit Sale Transaction' : 'New Sale Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer <span className="text-destructive">*</span></Label>
            <Select value={watch('customer_id')} onValueChange={(value) => setValue('customer_id', value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers?.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_id">Product <span className="text-destructive">*</span></Label>
            <Select value={watch('product_id')} onValueChange={(value) => setValue('product_id', value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (৳{product.price})
                  </SelectItem>
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
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : saleToEdit ? 'Update Sale' : 'Save Sale'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
