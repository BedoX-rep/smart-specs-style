import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import PhotoCapture from '@/components/PhotoCapture';
import FrameRecommendations from '@/components/FrameRecommendations';
import VirtualTryOn from '@/components/VirtualTryOn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Glasses, Sparkles } from 'lucide-react';

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

interface Analysis {
  face_shape: string;
  recommended_frame_shapes: string[];
  recommended_frame_sizes: string[];
  recommended_frame_colors: string[];
  reasoning: string;
}

const Index = () => {
  const [step, setStep] = useState<'capture' | 'recommendations' | 'try-on'>('capture');
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoConfirmed = async (photoBase64: string) => {
    setUserPhoto(photoBase64);
    setIsLoading(true);
    
    try {
      // Analyze face with Gemini
      const analyzeResponse = await supabase.functions.invoke('analyze-face', {
        body: { imageBase64: photoBase64 }
      });

      if (analyzeResponse.error) {
        throw new Error(analyzeResponse.error.message);
      }

      const faceAnalysis = analyzeResponse.data.analysis;
      setAnalysis(faceAnalysis);

      // Search for matching frames
      const searchResponse = await supabase.functions.invoke('search-frames', {
        body: {
          frameShapes: faceAnalysis.recommended_frame_shapes,
          frameSizes: faceAnalysis.recommended_frame_sizes,
          frameColors: faceAnalysis.recommended_frame_colors
        }
      });

      if (searchResponse.error) {
        throw new Error(searchResponse.error.message);
      }

      setProducts(searchResponse.data.products);
      setStep('recommendations');
      
      toast({
        title: "Analysis Complete!",
        description: `Found ${searchResponse.data.products.length} perfect frames for your ${faceAnalysis.face_shape} face shape.`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryOn = async (product: Product) => {
    setSelectedProduct(product);
    setStep('try-on');
    
    try {
      // Generate virtual try-on (simulation for now)
      const tryOnResponse = await supabase.functions.invoke('generate-try-on', {
        body: {
          userImageBase64: userPhoto,
          frameImageUrl: product.image_url,
          frameName: product.name
        }
      });

      if (tryOnResponse.data?.note) {
        toast({
          title: "Virtual Try-On",
          description: tryOnResponse.data.note,
        });
      }
    } catch (error) {
      console.error('Try-on error:', error);
    }
  };

  const handleBack = () => {
    if (step === 'try-on') {
      setStep('recommendations');
      setSelectedProduct(null);
    } else if (step === 'recommendations') {
      setStep('capture');
      setUserPhoto('');
      setAnalysis(null);
      setProducts([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-optical-light to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Glasses className="h-8 w-8 text-optical-blue" />
            <h1 className="text-4xl font-bold text-optical-dark">SmartSpecs</h1>
            <Sparkles className="h-6 w-6 text-optical-accent" />
          </div>
          <p className="text-xl text-muted-foreground">
            Find your perfect eyewear with AI-powered recommendations
          </p>
        </div>

        {/* Analysis Results */}
        {analysis && step !== 'capture' && (
          <Card className="mb-6 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-optical-dark">Your Face Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Face Shape:</strong> {analysis.face_shape}</p>
                <p><strong>Recommended Shapes:</strong> {analysis.recommended_frame_shapes.join(', ')}</p>
                <p><strong>Recommended Sizes:</strong> {analysis.recommended_frame_sizes.join(', ')}</p>
                <p><strong>Recommended Colors:</strong> {analysis.recommended_frame_colors.join(', ')}</p>
                <p className="text-sm text-muted-foreground mt-3">{analysis.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="flex justify-center">
          {step === 'capture' && (
            <PhotoCapture onPhotoConfirmed={handlePhotoConfirmed} />
          )}
          
          {step === 'recommendations' && (
            <FrameRecommendations
              products={products}
              userPhoto={userPhoto}
              isLoading={isLoading}
              onTryOn={handleTryOn}
            />
          )}
          
          {step === 'try-on' && selectedProduct && (
            <VirtualTryOn
              product={selectedProduct}
              userPhoto={userPhoto}
              onBack={handleBack}
            />
          )}
        </div>

        {/* Back button for recommendations */}
        {step === 'recommendations' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleBack}
              className="text-optical-blue hover:text-optical-blue/80 underline"
            >
              ← Take a new photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
