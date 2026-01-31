export interface User {
  id: string;
  avatar: string;
  name: string;
  username: string;
  password: string;
  location: string;
  bio: string;
  joinedDate: string;
  stats: UserStats;
}

// User without password for API responses
export type PublicUser = Omit<User, 'password'>;

export interface UserStats {
  submissions: number;
  followers: number;
  following: number;
}