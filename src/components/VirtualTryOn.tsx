import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  frame_shape: string;
  frame_size: string;
  frame_color: string;
  material: string;
  price: number;
  image_url: string;
  in_stock: boolean;
  description: string;
}

interface VirtualTryOnProps {
  product: Product;
  userPhoto: string;
  tryOnImage?: string;
  onBack: () => void;
}

export default function VirtualTryOn({ 
  product, 
  userPhoto, 
  tryOnImage, 
  onBack 
}: VirtualTryOnProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-optical-dark">Virtual Try-On</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* User photo with frame overlay */}
          <div className="space-y-3">
            <h3 className="font-semibold text-optical-dark">You wearing {product.name}</h3>
            <div className="aspect-square bg-optical-light rounded-lg overflow-hidden relative">
              <img
                src={tryOnImage || `data:image/jpeg;base64,${userPhoto}`}
                alt="Virtual try-on"
                className="w-full h-full object-cover"
              />
              {!tryOnImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-sm">Try-on simulation</p>
                    <p className="text-xs opacity-75">Glasses overlay would appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Frame details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-optical-dark text-lg">{product.name}</h3>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{product.frame_shape}</Badge>
              <Badge variant="secondary">{product.frame_size}</Badge>
              <Badge variant="secondary">{product.frame_color}</Badge>
              <Badge variant="secondary">{product.material}</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{product.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-optical-dark">${product.price}</span>
                <Badge variant={product.in_stock ? "default" : "secondary"}>
                  {product.in_stock ? "In Stock" : "Available to Order"}
                </Badge>
              </div>
              
              <Button 
                className="w-full bg-optical-accent hover:bg-optical-accent/90"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.in_stock ? "Add to Cart" : "Order Now"}
              </Button>
            </div>
            
            <div className="aspect-video bg-optical-light rounded-lg overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}