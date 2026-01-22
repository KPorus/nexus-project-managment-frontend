import { mapProject, mapUser } from "../helpers/maper";
import { KEYS, request } from "../helpers/request";
import type { ProjectStatus, User } from "../types";

export const ApiService = {
  auth: {
    login: async (email: string, password?: string) => {
      const result = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token =
        localStorage.getItem(KEYS.TOKEN) || result.data?.accessToken;
      if (token) localStorage.setItem(KEYS.TOKEN, token);

      const user: User = {
        id: result.data.id,
        email: result.data.email,
        role: result.data.role,
        status: result.data.status,
      };

      localStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
      return { user, token };
    },
  },

  user: {
    list: async (page = 1, limit = 10) => {
      const result = await request("/auth/get-all-users", {
        method: "POST",
        body: JSON.stringify({ page, limit }),
      });
      const { users: rawUsers = [], total = 0 } = result.data || {};
      const users = Array.isArray(rawUsers) ? rawUsers.map(mapUser) : [];
      return { users, total };
    },
  },

  project: {
    list: async () => {
      const result = await request("/projects", {
        method: "GET",
      });
      const projects = Array.isArray(result.data)
        ? result.data
        : result.data?.projects || [];
      return Array.isArray(projects) ? projects.map(mapProject) : [];
    },
    create: async (name: string, description: string) => {
      const result = await request("/projects", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
      return mapProject(result.data?.project || result.data);
    },
    edit: async (
      name: string,
      description: string,
      status: ProjectStatus,
      id: string
    ) => {
      const result = await request(`/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, description, status }),
      });
      return mapProject(result.data?.project || result.data);
    },
  },
};
