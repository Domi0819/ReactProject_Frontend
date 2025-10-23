import type { Route } from "./+types/todos/";

export function meta({}: Route.MetaArgs) {
    return [
        {title : "Todos"},
        {name: "todos", content: "Todos page"}
    ];
}

export default function Todos() {
    return(
        <main className="container mx-auto p-4">
            <h1>Todos Page</h1>
            <p>This is the todos page.</p>
        </main>
    )
}