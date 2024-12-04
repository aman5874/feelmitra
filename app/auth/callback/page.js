'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get the code from the URL
        const code = new URLSearchParams(window.location.search).get('code');
        
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          
          if (data.session) {
            window.location.href = '/dashboard';
            return;
          }
        }

        // If no code, check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          window.location.href = '/dashboard';
          return;
        }

        // If no session and no code, redirect to auth
        window.location.href = '/auth';
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/auth';
      }
    };

    processAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
} 