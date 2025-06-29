// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/supabaseServer';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  const origin = request.nextUrl.origin; // absolute base like https://yourapp.com
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('❌ Session exchange failed:', error.message);
      return NextResponse.redirect(`${origin}/login?error=verification_failed`);
    }

    if (!data.user) {
      console.error('❌ No user data returned');
      return NextResponse.redirect(`${origin}/login?error=no_user_data`);
    }

    console.log('✅ User verified successfully:', data.user.email);
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.redirect(`${origin}/login?error=unexpected_error`);
  }
}
