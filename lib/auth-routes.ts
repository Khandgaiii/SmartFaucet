/** Routes that do not require a signed-in user */
export function isPublicAuthPath(pathname: string): boolean {
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/reset-password"
  ) {
    return true
  }
  if (pathname.startsWith("/auth/")) {
    return true
  }
  return false
}
