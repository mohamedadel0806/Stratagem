import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Proxy API route for Keycloak OpenID configuration
// This allows NextAuth to fetch OpenID config using Docker network URL
// while keeping the public URL for browser redirects

const getKeycloakInternalUrl = () => {
  if (process.env.KEYCLOAK_URL) {
    return process.env.KEYCLOAK_URL;
  }
  return 'http://localhost:8080';
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle Next.js 15+ where params is a Promise
    const params = context.params instanceof Promise 
      ? await context.params 
      : context.params;
    const pathArray = params?.path || [];
    const path = pathArray.join('/');
    const internalUrl = getKeycloakInternalUrl();
    const targetUrl = `${internalUrl}/${path}`;
    
    console.log(`Proxying Keycloak request: ${targetUrl}`);
    
    const response = await axios.get(targetUrl, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // If this is the well-known OpenID config, replace URLs appropriately
    if (path.includes('.well-known/openid-configuration')) {
      const config = response.data;
      const publicIssuer = process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/grc-platform';
      const publicBaseUrl = publicIssuer.replace('/realms/grc-platform', '');
      
      // Create a modified config where:
      // - Browser endpoints (authorization, logout) use public URL (localhost:8080)
      // - Server-side endpoints (token, userinfo, jwks) use internal Docker URL (keycloak:8080)
      const modifiedConfig: any = {
        ...config,
        issuer: publicIssuer,
        // Browser endpoints - use public URL
        authorization_endpoint: config.authorization_endpoint?.replace(internalUrl, publicBaseUrl) || `${publicBaseUrl}/realms/grc-platform/protocol/openid-connect/auth`,
        end_session_endpoint: config.end_session_endpoint?.replace(internalUrl, publicBaseUrl) || `${publicBaseUrl}/realms/grc-platform/protocol/openid-connect/logout`,
        revocation_endpoint: config.revocation_endpoint?.replace(internalUrl, publicBaseUrl) || `${publicBaseUrl}/realms/grc-platform/protocol/openid-connect/revoke`,
        // Server-side endpoints - keep internal Docker URL for NextAuth to use
        token_endpoint: config.token_endpoint || `${internalUrl}/realms/grc-platform/protocol/openid-connect/token`,
        userinfo_endpoint: config.userinfo_endpoint || `${internalUrl}/realms/grc-platform/protocol/openid-connect/userinfo`,
        jwks_uri: config.jwks_uri || `${internalUrl}/realms/grc-platform/protocol/openid-connect/certs`,
      };
      
      // Replace any remaining internal URLs in other endpoints
      Object.keys(modifiedConfig).forEach(key => {
        if (typeof modifiedConfig[key] === 'string' && modifiedConfig[key].includes(internalUrl)) {
          // For endpoints that need to be public (for browser), use public URL
          if (key.includes('authorization') || key.includes('logout') || key.includes('revocation') || key.includes('device')) {
            modifiedConfig[key] = modifiedConfig[key].replace(internalUrl, publicBaseUrl);
          }
          // For server-side endpoints, keep internal URL
        }
      });
      
      console.log('Modified OpenID config - authorization:', modifiedConfig.authorization_endpoint);
      console.log('Modified OpenID config - token:', modifiedConfig.token_endpoint);
      
      return NextResponse.json(modifiedConfig);
    }
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Keycloak proxy error:', error.message);
    return NextResponse.json(
      { error: 'Failed to proxy Keycloak request', message: error.message },
      { status: 500 }
    );
  }
}

