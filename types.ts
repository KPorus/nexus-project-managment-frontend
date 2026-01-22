export const Role = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

// UserStatus
export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ProjectStatus
export const ProjectStatus = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED",
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  invitedAt?: string;
  createdAt?: string;
}

export interface UsersResponse {
  total: number;
  users: User[];
}


export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  isDeleted: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invite {
  id: string;
  email: string;
  role: Role;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DataState {
  projects: Project[];
  // users?: UsersResponse;
  loading: boolean;
  error: string | null;
}
