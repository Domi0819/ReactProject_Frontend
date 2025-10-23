import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
// removed useNavigate import to avoid dependency on react-router-dom in this workspace
import "primereact/resources/themes/lara-light-cyan/theme.css";

import type { Route } from "./+types/root";
import "./app.css";

import { PrimeReactProvider } from "primereact/api";
import {Menubar} from "primereact/menubar";
import React, {useState, useEffect} from "react";
import {Button} from "primereact/button";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // build menu items dynamically so some items can be hidden for unauthenticated users
  const todoMenu = {
    label: 'TODO',
    icon: 'pi pi-search',
    items: [
      { label: 'Create', icon: 'pi pi-bolt' , url: '/menu/todos_create'},
      { label: 'My TODOs', icon: 'pi pi-server' , url: '/menu/todos'},
    ],
  };

  // helper to detect token presence (guarded for SSR)
  const hasToken = () => typeof window !== 'undefined' && !!(localStorage.getItem('access_token') || localStorage.getItem('token'));

  // start unauthenticated on first render (safe for SSR)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    // on client mount and when route changes, re-check auth
    setIsAuthenticated(hasToken());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    // listen for storage changes (other tabs) and update auth state
    function onStorage(e: StorageEvent) {
      if (e.key === 'access_token' || e.key === 'token') {
        setIsAuthenticated(hasToken());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const items = [
    { label: 'Home', icon: 'pi pi-home', url: '/' },
    ...(isAuthenticated ? [todoMenu] : []),
    { label: 'Features', icon: 'pi pi-star', url: '/menu/features' },
    { label: 'Contact', icon: 'pi pi-envelope' },
  ];

  function handleLogout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  }

  const end = isAuthenticated ? (
    <div>
      <Button icon="pi pi-user" className="p-button-rounded p-button-info" onClick={() => {}} style={{marginRight: '12px'}} />
      <Button label="Logout" onClick={handleLogout} />
    </div>
  ) : (
    <div >
      <a href="/auth/login"><Button style={{marginRight:"12px"}} label={'LogIn'} /></a>
      <a href="/auth/register"><Button label={'Register'} /></a>
    </div>
  );

  return  <PrimeReactProvider>
    <Menubar model={items} end={end}/>
    <Outlet />
    </PrimeReactProvider>

}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
