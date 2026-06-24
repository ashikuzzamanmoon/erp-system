import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching customers: ${error.message}`);
  }

  return data;
}

export async function createCustomer(customer: Omit<Customer, 'created_at' | 'id'>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating customer: ${error.message}`);
  }

  return data;
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating customer: ${error.message}`);
  }

  return data;
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting customer: ${error.message}`);
  }
}
