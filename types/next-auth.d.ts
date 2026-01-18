import 'next-auth';

declare module 'next-auth' {
  interface User {
    username: string;
    avatar?: string;
    rank: string;
    trustScore: number;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      avatar?: string;
      rank: string;
      trustScore: number;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    avatar?: string;
    rank: string;
    trustScore: number;
  }
}
