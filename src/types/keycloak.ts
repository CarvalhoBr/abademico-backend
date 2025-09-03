export interface CreateKeycloakUser {
  enabled: boolean;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  credentials?: {
    type: 'password';
    value: string;
    temporary: boolean;
  }[];
  requiredActions?: string[];
  emailVerified?: boolean;
}