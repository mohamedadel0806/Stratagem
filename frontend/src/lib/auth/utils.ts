import { Session } from "next-auth";

export function hasRole(session: Session | null, role: string): boolean {
  // This is a placeholder. In a real implementation, we would parse the access token
  // or look up the user's roles from the session to check for the required role.
  // Keycloak usually puts roles in the access token under `realm_access.roles` or `resource_access`.
  
  // For now, we'll just assume true for admin if the user is logged in for testing.
  if (!session || !session.user) {
    return false;
  }
  
  // TODO: Parse JWT to get actual roles
  return true; 
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session && !!session.user;
}