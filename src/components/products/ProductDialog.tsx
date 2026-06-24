import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { type Product, createProduct, updateProduct, uploadProductImage } from '../../api/products';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  stock_quantity: z.number().int().min(0, 'Stock must be non-negative'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductDialog({ isOpen, onClose, product }: ProductDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      stock_quantity: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock_quantity: product.stock_quantity,
      });
    } else {
      reset({ name: '', sku: '', price: 0, stock_quantity: 0 });
    }
    setFile(null);
  }, [product, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      let image_url = product?.image_url;

      if (file) {
        image_url = await uploadProductImage(file);
      }

      if (product) {
        return updateProduct(product.id, { ...data, image_url });
      } else {
        return createProduct({ ...data, image_url });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  const onSubmit = (data: ProductFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input 
              id="sku" 
              {...register('sku')} 
              onFocus={() => {
                if (!getValues('sku')) {
                  const name = getValues('name');
                  if (name) {
                    const generatedSku = name.trim().toUpperCase().replace(/\s+/g, '-');
                    setValue('sku', generatedSku, { shouldValidate: true });
                  }
                }
              }}
            />
            {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                {...register('price', { valueAsNumber: true })} 
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock</Label>
              <Input 
                id="stock_quantity" 
                type="number" 
                {...register('stock_quantity', { valueAsNumber: true })} 
              />
              {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
            {product?.image_url && !file && (
              <p className="text-sm text-muted-foreground mt-1">Current image exists. Upload a new one to replace it.</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
