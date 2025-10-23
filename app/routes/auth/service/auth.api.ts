import { api } from "../../../services/api";

export type Auth = { firstname: string, lastname: string, email: string, password: string };
export type Login = { email: string, password: string }

export const authApi = {
    list: () => api.get<Auth[]>("/todos").then((r: any) => r.data),
    create: (body: Auth) => api.post<Auth>("/auth/register", { ...body }).then((r: any) => r.data),
    toggle: (id: number, completed: boolean) =>
        api.patch<Auth>(`/todos/${id}`, { completed }).then((r: any) => r.data),
    remove: (id: number) => api.delete<void>(`/todos/${id}`).then((r: any) => r.data),
    login: (body: Login) => api.post<Login>("/token", body),
    getCurrentUser: () => {
        const token = localStorage.getItem("token");
        return api.get<Auth>("/users/me/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((r: any) => r.data);
    },
};