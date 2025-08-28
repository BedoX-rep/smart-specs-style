-- Enable Row Level Security on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read products (public store inventory)
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;