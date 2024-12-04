import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Await cookies before creating Supabase client
    const cookieStore = await cookies();
    
    // Create Supabase client with awaited cookies
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore
    });

    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const userData = body.userData;

    if (!userData?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', userData.email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ user_id: existingUser.user_id });
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: session.user.email,
          username: userData.username || session.user.email.split('@')[0]
        }
      ])
      .select('user_id')
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log('Successfully created user:', newUser);
    return NextResponse.json({ user_id: newUser.user_id });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
} 