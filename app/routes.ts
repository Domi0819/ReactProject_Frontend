import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/menu/home.tsx"),
    ...prefix("menu", [
        route("features", "routes/menu/features.tsx"),
        route("todos_create", "routes/menu/todos_create.tsx"),
        route("todos", "routes/menu/todos.tsx"),
    ]),
    ...prefix("auth", [
        route("login", "routes/auth/login.tsx"),
        route("register", "routes/auth/register.tsx"),
    ])
] satisfies RouteConfig;
