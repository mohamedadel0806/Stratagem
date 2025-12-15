import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> | { path?: string[] } }
) {
  // Handle both Promise and direct params (Next.js 15+ uses Promise)
  const resolvedParams = params instanceof Promise ? await params : params;
  const pathSegments = resolvedParams.path || [];
  const path = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';
  const queryString = request.nextUrl.search;
  
  // Reject empty paths - they shouldn't go through the proxy
  if (!path || path === '/') {
    console.error('Empty path requested to proxy:', request.nextUrl.pathname);
    return NextResponse.json(
      { message: 'Invalid proxy path' },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      console.log('No session or accessToken found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}${path}${queryString}`;
    console.log(`Proxying GET request to: ${url}`);
    console.log(`Authorization header: Bearer ${session.accessToken.substring(0, 20)}...`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Backend response status: ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    
    // Read the response body once
    const responseText = await response.text();

    // Extra debug for risks, risk-treatments, and assets endpoints to surface backend validation errors
    if (path.startsWith('/risks') || path.startsWith('/risk-treatments') || path.startsWith('/assets')) {
      console.log(`[proxy][${path}] status:`, response.status);
      console.log(`[proxy][${path}] content-type:`, contentType);
      console.log(`[proxy][${path}] query string:`, queryString);
      console.log(`[proxy][${path}] request URL:`, url);
      if (!response.ok) {
        console.error(`[proxy][${path}] ERROR - Full response:`, responseText);
      } else {
        console.log(`[proxy][${path}] response (first 500 chars):`, responseText.substring(0, 500));
      }
    }
    
    if (!response.ok) {
      console.error(`[proxy][${path}] Backend error: ${response.status}`);
      console.error(`[proxy][${path}] Request URL: ${url}`);
      console.error(`[proxy][${path}] Error response (full):`, responseText);
      // Try to parse as JSON if it looks like JSON
      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { message: responseText || 'Backend request failed' },
          { status: response.status }
        );
      }
    }

    // Try to parse as JSON
    if (!responseText.trim()) {
      return NextResponse.json({}, { status: response.status });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content-Type:', contentType);
      console.error('Response text (first 1000 chars):', responseText.substring(0, 1000));
      console.error('Response length:', responseText.length);
      
      // If it's supposed to be JSON but parsing failed, return error
      if (contentType.includes('application/json')) {
        return NextResponse.json(
          { 
            message: 'Invalid JSON response from backend', 
            error: String(parseError),
            responsePreview: responseText.substring(0, 200)
          },
          { status: 500 }
        );
      }
      
      // Non-JSON response - return as text message
      return NextResponse.json(
        { message: responseText, contentType },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> | { path?: string[] } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const pathSegments = resolvedParams.path || [];
  const path = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}${path}`;
    const contentType = request.headers.get('content-type') || '';

    // Handle multipart/form-data (file uploads)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Enhanced logging for assets endpoints
      if (path.startsWith('/assets')) {
        console.log(`[proxy][POST][${path}] Request URL:`, url);
        console.log(`[proxy][POST][${path}] Content-Type: multipart/form-data`);
        console.log(`[proxy][POST][${path}] FormData keys:`, Array.from(formData.keys()));
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          // Don't set Content-Type - let fetch set it with boundary
        },
        body: formData,
      });

      const responseContentType = response.headers.get('content-type') || '';
      const responseText = await response.text();
      
      if (!response.ok) {
        // Enhanced error logging for assets endpoints
        if (path.startsWith('/assets')) {
          console.error(`[proxy][POST][${path}] Backend error: ${response.status}`);
          console.error(`[proxy][POST][${path}] Error response:`, responseText);
        }
        try {
          const errorData = JSON.parse(responseText);
          return NextResponse.json(errorData, { status: response.status });
        } catch {
          return NextResponse.json(
            { message: responseText || 'Backend request failed' },
            { status: response.status }
          );
        }
      }

      if (!responseText.trim()) {
        return NextResponse.json({}, { status: response.status });
      }

      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: response.status });
      } catch (parseError) {
        console.error('JSON parse error in POST:', parseError);
        if (responseContentType.includes('application/json')) {
          return NextResponse.json(
            { message: 'Invalid JSON response from backend', error: String(parseError) },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { message: responseText, contentType: responseContentType },
          { status: response.status }
        );
      }
    }

    // Handle JSON requests
    const body = await request.json();

    // Enhanced logging for assets endpoints
    if (path.startsWith('/assets')) {
      console.log(`[proxy][POST][${path}] Request URL:`, url);
      console.log(`[proxy][POST][${path}] Request body:`, JSON.stringify(body, null, 2));
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseContentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    if (!response.ok) {
      // Enhanced error logging for assets endpoints
      if (path.startsWith('/assets')) {
        console.error(`[proxy][POST][${path}] Backend error: ${response.status}`);
        console.error(`[proxy][POST][${path}] Error response:`, responseText);
      }
      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { message: responseText || 'Backend request failed' },
          { status: response.status }
        );
      }
    }

    if (!responseText.trim()) {
      return NextResponse.json({}, { status: response.status });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch (parseError) {
      console.error('JSON parse error in POST:', parseError);
      if (responseContentType.includes('application/json')) {
        return NextResponse.json(
          { message: 'Invalid JSON response from backend', error: String(parseError) },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: responseText, contentType: responseContentType },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> | { path?: string[] } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const pathSegments = resolvedParams.path || [];
  const path = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}${path}`;
    const body = await request.json();

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { message: responseText || 'Backend request failed' },
          { status: response.status }
        );
      }
    }

    if (!responseText.trim()) {
      return NextResponse.json({}, { status: response.status });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch (parseError) {
      console.error('JSON parse error in PUT:', parseError);
      if (contentType.includes('application/json')) {
        return NextResponse.json(
          { message: 'Invalid JSON response from backend', error: String(parseError) },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: responseText, contentType },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> | { path?: string[] } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const pathSegments = resolvedParams.path || [];
  const path = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}${path}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok && response.headers.get('content-length') === '0') {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { message: responseText || 'Backend request failed' },
          { status: response.status }
        );
      }
    }

    if (!responseText.trim()) {
      return NextResponse.json({}, { status: response.status });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch (parseError) {
      console.error('JSON parse error in DELETE:', parseError);
      if (contentType.includes('application/json')) {
        return NextResponse.json(
          { message: 'Invalid JSON response from backend', error: String(parseError) },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: responseText, contentType },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> | { path?: string[] } }
) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const pathSegments = resolvedParams.path || [];
  const path = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';

  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}${path}`;
    const body = await request.json();

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        return NextResponse.json(errorData, { status: response.status });
      } catch {
        return NextResponse.json(
          { message: responseText || 'Backend request failed' },
          { status: response.status }
        );
      }
    }

    if (!responseText.trim()) {
      return NextResponse.json({}, { status: response.status });
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data, { status: response.status });
    } catch (parseError) {
      console.error('JSON parse error in PATCH:', parseError);
      if (contentType.includes('application/json')) {
        return NextResponse.json(
          { message: 'Invalid JSON response from backend', error: String(parseError) },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { message: responseText, contentType },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

