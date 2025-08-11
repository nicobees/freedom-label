import {
  Router,
  RouterProvider,
  Link,
  Outlet,
  RootRoute,
  Route,
  type AnyRouter,
} from '@tanstack/react-router';
import { createMemoryHistory } from '@tanstack/history';
import type { PropsWithChildren } from 'react';

function Header() {
  return (
    <header className="app-header" aria-label="Application header">
      <nav aria-label="Main">
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link" aria-label="Home link">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/create"
              className="nav-link"
              aria-label="Create Label link"
            >
              Create Label
            </Link>
          </li>
          <li>
            {/* Disabled for MVP */}
            <span
              className="nav-link disabled"
              aria-disabled="true"
              title="Not available yet"
            >
              List Label
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main" role="main">
        {children}
      </main>
    </div>
  );
}

function HomePage() {
  return (
    <section className="home-screen">
      <div className="home-actions" role="group" aria-label="Main actions">
        <h1 className="visually-hidden">Home</h1>
        <Link
          to="/create"
          className="btn btn-primary"
          aria-label="Create Label"
        >
          Create Label
        </Link>
        <span
          className="btn btn-secondary disabled"
          role="button"
          aria-disabled="true"
          title="Not available yet"
        >
          Label List (Disabled)
        </span>
      </div>
    </section>
  );
}

function CreateLabelPage() {
  return (
    <section>
      <h1>Create Label</h1>
      <p>Form will be implemented in subsequent stories.</p>
    </section>
  );
}

function ListLabelPageDisabled() {
  return (
    <section>
      <h1>List Label</h1>
      <p title="Not available yet">Not available yet</p>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </section>
  );
}

const rootRoute = new RootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: NotFoundPage,
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const createLabelRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreateLabelPage,
});

const listLabelRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/list',
  component: ListLabelPageDisabled,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  createLabelRoute,
  listLabelRoute,
]);

export function createAppRouter(history?: unknown): AnyRouter {
  const R: any = Router;
  return new R({ routeTree, history });
}

// For tests convenience
export function createMemoryAppRouter(
  initialEntries: string[] = ['/'],
): AnyRouter {
  const history = createMemoryHistory({ initialEntries });
  return createAppRouter(history);
}

export { RouterProvider };
