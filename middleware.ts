export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/documents/:path*", "/scan/:path*", "/admin", "/admin/:path*"],
};
