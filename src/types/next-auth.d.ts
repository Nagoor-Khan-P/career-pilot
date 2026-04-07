import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    username?: string;
  }
}
