import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye } from 'lucide-react';

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

interface FrameRecommendationsProps {
  products: Product[];
  userPhoto: string;
  isLoading: boolean;
  onTryOn: (product: Product) => void;
}

export default function FrameRecommendations({ 
  products, 
  userPhoto, 
  isLoading, 
  onTryOn 
}: FrameRecommendationsProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-optical-blue mr-2" />
          <span className="text-optical-dark">Finding perfect frames for you...</span>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8">
          <p className="text-optical-dark">No matching frames found. Please try again with a different photo.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-optical-dark">Recommended Frames for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 bg-optical-light/50">
              <div className="aspect-square mb-3 bg-background rounded-lg overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-optical-dark">{product.name}</h3>
                  <Badge variant={product.in_stock ? "default" : "secondary"}>
                    {product.in_stock ? "In Stock" : "Order"}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    {product.frame_shape}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.frame_size}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.frame_color}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-optical-dark">${product.price}</span>
                  <Button
                    onClick={() => onTryOn(product)}
                    size="sm"
                    className="bg-optical-blue hover:bg-optical-blue/90"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Try On
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}