import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { frameShapes, frameSizes, frameColors } = await req.json();

    const supabaseUrl = "https://ckdkxzdtpstepefnopym.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrZGt4emR0cHN0ZXBlZm5vcHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MTk5ODAsImV4cCI6MjA3MTk5NTk4MH0.PknQcsyT8rmtPQFSIKJuy7uWQ_zdv60NwImOlo3aKOA";
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Searching for frames with criteria:', { frameShapes, frameSizes, frameColors });

    // Build the query with filters
    let query = supabase
      .from('products')
      .select('*');

    // Filter by frame shapes
    if (frameShapes && frameShapes.length > 0) {
      query = query.in('frame_shape', frameShapes);
    }

    // Filter by frame sizes
    if (frameSizes && frameSizes.length > 0) {
      query = query.in('frame_size', frameSizes);
    }

    // Filter by frame colors
    if (frameColors && frameColors.length > 0) {
      query = query.in('frame_color', frameColors);
    }

    // Limit to 5 results and prioritize in-stock items
    const { data: products, error } = await query
      .order('in_stock', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Found products:', products);

    return new Response(JSON.stringify({ products }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in search-frames function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});