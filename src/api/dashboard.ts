import { supabase } from '../lib/supabase';

export async function getProductsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching products count: ${error.message}`);
  }

  return count || 0;
}

export async function getCustomersCount(): Promise<number> {
  const { count, error } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching customers count: ${error.message}`);
  }

  return count || 0;
}

export async function getSalesRevenue(): Promise<number> {
  const { data, error } = await supabase
    .from('sales')
    .select('total_amount')
    .eq('status', 'Completed');

  if (error) {
    throw new Error(`Error fetching sales revenue: ${error.message}`);
  }

  return data.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
}

export async function getPurchaseCost(): Promise<number> {
  const { data, error } = await supabase
    .from('purchases')
    .select('total_amount')
    .eq('status', 'Received');

  if (error) {
    throw new Error(`Error fetching purchase cost: ${error.message}`);
  }

  return data.reduce((sum, purchase) => sum + (purchase.total_amount || 0), 0);
}

export async function getSuppliersCount(): Promise<number> {
  const { count, error } = await supabase
    .from('suppliers')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching suppliers count: ${error.message}`);
  }

  return count || 0;
}

export async function getSalesCount(): Promise<number> {
  const { count, error } = await supabase
    .from('sales')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching sales count: ${error.message}`);
  }

  return count || 0;
}

export async function getPurchasesCount(): Promise<number> {
  const { count, error } = await supabase
    .from('purchases')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching purchases count: ${error.message}`);
  }

  return count || 0;
}
