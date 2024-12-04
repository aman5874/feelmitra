import { NextResponse } from 'next/server';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request) {
  const supabase = createClientComponentClient();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      exists: !!data,
      user: data 
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 