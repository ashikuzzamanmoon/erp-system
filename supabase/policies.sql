-- Enable full CRUD access for authenticated users on all tables

-- Profiles
CREATE POLICY "Enable full access for authenticated users" ON profiles FOR ALL TO authenticated USING (true);

-- Products
CREATE POLICY "Enable full access for authenticated users" ON products FOR ALL TO authenticated USING (true);

-- Customers
CREATE POLICY "Enable full access for authenticated users" ON customers FOR ALL TO authenticated USING (true);

-- Suppliers
CREATE POLICY "Enable full access for authenticated users" ON suppliers FOR ALL TO authenticated USING (true);

-- Purchases
CREATE POLICY "Enable full access for authenticated users" ON purchases FOR ALL TO authenticated USING (true);

-- Purchase Items
CREATE POLICY "Enable full access for authenticated users" ON purchase_items FOR ALL TO authenticated USING (true);

-- Sales
CREATE POLICY "Enable full access for authenticated users" ON sales FOR ALL TO authenticated USING (true);

-- Sale Items
CREATE POLICY "Enable full access for authenticated users" ON sale_items FOR ALL TO authenticated USING (true);
