import type { Route } from "./+types/features";

export function meta({}: Route.MetaArgs) {
    return [
        {title : "Features"},
        {name: "features", content: "Features page"}
    ];
}

export default function Features() {
    return(
        <main className="container mx-auto p-4">
            <h1>Features Page</h1>
            <p>This is the features page.</p>
        </main>
    )
}