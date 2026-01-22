import type { Project, User } from "../types";


export const mapProject = (t: any): Project => {
  if (!t) return null as any;
  return {
    id: t._id,
    name: t.name,
    description: t.description,
    status: t.status,
    createdBy: t.createdBy,
    createdAt: t.createdAt,
    isDeleted: t.isDeleted,
    updatedAt : t.updatedAt
  };
};

export const mapUser = (u: any): User => {
  return {
    id: u._id,
    email: u.email,
    role: u.role,
    status: u.status,
  };
};
