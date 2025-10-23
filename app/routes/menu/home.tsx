export function meta(_: any) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token')) : null;
  const isAuthenticated = !!token;

  if (isAuthenticated){
    return(
      <main className="container mx-auto p-4">
        <h1>Welcome back!</h1>
        <p>This is the authenticated home (show user data, dashboard, etc.).</p>
        {/* authenticated widgets, todos, etc. */}
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <h1>Welcome to the public site</h1>
      <p>This is the public homepage (marketing, login/register links, etc.).</p>
    </main>
  )
}
