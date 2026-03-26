type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined | undefined;
  sub: string;
  role: string;
  permissions: string;
  identities?: string;
};
