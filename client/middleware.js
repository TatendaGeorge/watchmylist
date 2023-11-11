import { authMiddleware } from '@clerk/clerk-react';

export default authMiddleware({
  // publicRoutes: ['/'],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};