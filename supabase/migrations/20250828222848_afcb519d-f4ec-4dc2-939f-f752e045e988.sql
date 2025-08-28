-- Create products table for optical frames
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  frame_shape TEXT NOT NULL, -- round, square, oval, cat-eye, aviator, etc.
  frame_size TEXT NOT NULL, -- small, medium, large
  frame_color TEXT NOT NULL,
  material TEXT,
  price DECIMAL(10,2),
  image_url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Create storage bucket for generated try-on images
INSERT INTO storage.buckets (id, name, public) VALUES ('try-on-images', 'try-on-images', true);

-- Storage policies for photos bucket
CREATE POLICY "Anyone can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Anyone can view photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'photos');

-- Storage policies for try-on-images bucket
CREATE POLICY "Anyone can upload try-on images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'try-on-images');

CREATE POLICY "Anyone can view try-on images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'try-on-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, brand, frame_shape, frame_size, frame_color, material, price, image_url, description) VALUES
('Classic Round', 'VisionPro', 'round', 'medium', 'black', 'acetate', 120.00, 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400', 'Classic round frames perfect for square face shapes'),
('Square Bold', 'FrameMaster', 'square', 'large', 'brown', 'metal', 150.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', 'Bold square frames ideal for round faces'),
('Oval Elegance', 'StyleVision', 'oval', 'small', 'gold', 'titanium', 200.00, 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400', 'Elegant oval frames suitable for angular faces'),
('Cat-Eye Chic', 'FashionFrame', 'cat-eye', 'medium', 'red', 'acetate', 180.00, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400', 'Stylish cat-eye frames for a vintage look'),
('Aviator Classic', 'SkyView', 'aviator', 'large', 'silver', 'metal', 160.00, 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400', 'Classic aviator style frames');