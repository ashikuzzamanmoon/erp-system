-- Trigger function to increment stock quantity on purchase
CREATE OR REPLACE FUNCTION increment_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity + NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for increment_stock
CREATE TRIGGER increment_stock_trigger
AFTER INSERT ON purchase_items
FOR EACH ROW
EXECUTE FUNCTION increment_stock();


-- Trigger function to decrement stock quantity on sale
CREATE OR REPLACE FUNCTION decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for decrement_stock
CREATE TRIGGER decrement_stock_trigger
AFTER INSERT ON sale_items
FOR EACH ROW
EXECUTE FUNCTION decrement_stock();
