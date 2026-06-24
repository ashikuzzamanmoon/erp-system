import { supabase } from '../lib/supabase';
import { type Product } from './products';
import { type Supplier } from './suppliers';
import { type Customer } from './customers';

export interface Purchase {
  id: string;
  supplier_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status?: string;
  created_at: string;
  supplier?: Supplier;
  product?: Product;
}

export interface Sale {
  id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status?: string;
  created_at: string;
  customer?: Customer;
  product?: Product;
}

// Purchases APIs
export async function getPurchases(): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      supplier:suppliers(name),
      product:products(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching purchases: ${error.message}`);
  }

  return data;
}

export async function createPurchase(purchase: Omit<Purchase, 'id' | 'created_at' | 'supplier' | 'product'>): Promise<Purchase> {
  const { data, error } = await supabase
    .from('purchases')
    .insert([purchase])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating purchase: ${error.message}`);
  }

  return data;
}

export async function updatePurchase(id: string, purchase: Partial<Purchase>): Promise<Purchase> {
  const payload = { ...purchase };
  delete payload.supplier;
  delete payload.product;

  const { data, error } = await supabase
    .from('purchases')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating purchase: ${error.message}`);
  }

  return data;
}

export async function deletePurchase(id: string): Promise<void> {
  const { error } = await supabase
    .from('purchases')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting purchase: ${error.message}`);
  }
}

// Sales APIs
export async function getSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      customer:customers(name),
      product:products(name, price)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching sales: ${error.message}`);
  }

  return data;
}

export async function createSale(sale: Omit<Sale, 'id' | 'created_at' | 'customer' | 'product'>): Promise<Sale> {
  const { data, error } = await supabase
    .from('sales')
    .insert([sale])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating sale: ${error.message}`);
  }

  return data;
}

export async function updateSale(id: string, sale: Partial<Sale>): Promise<Sale> {
  const payload = { ...sale };
  delete payload.customer;
  delete payload.product;

  const { data, error } = await supabase
    .from('sales')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating sale: ${error.message}`);
  }

  return data;
}

export async function deleteSale(id: string): Promise<void> {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting sale: ${error.message}`);
  }
}
