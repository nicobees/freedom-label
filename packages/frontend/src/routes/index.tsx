import type { PropsWithChildren } from 'react';

import { createMemoryHistory, type RouterHistory } from '@tanstack/history';
import {
  type AnyRouter,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

function CreateLabelPage() {
  return (
    <section>
      <h1>Create Label</h1>
      <p>Form will be implemented in subsequent stories.</p>
    </section>
  );
}

function Header() {
  return (
    <header aria-label="Application header" className="app-header">
      <nav aria-label="Main">
        <ul className="nav-list">
          <li>
            <Link aria-label="Home link" className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link
              aria-label="Create Label link"
              className="nav-link"
              to="/create"
            ></Link>
          </li>
          <li>
            {/* Disabled for MVP */}
            <span
              aria-disabled="true"
              className="nav-link disabled"
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

function HomePage() {
  return (
    <section className="home-screen">
      <div aria-label="Main actions" className="home-actions" role="group">
        <h1 className="visually-hidden">Home</h1>
        <Link
          aria-label="Create Label"
          className="btn btn-primary"
          to="/create"
        >
          Create Label
        </Link>
        <span
          aria-disabled="true"
          className="btn btn-secondary disabled"
          role="button"
          title="Not available yet"
        >
          Label List (Disabled)
        </span>
      </div>
    </section>
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

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  component: HomePage,
  getParentRoute: () => rootRoute,
  path: '/',
});

const createLabelRoute = createRoute({
  component: CreateLabelPage,
  getParentRoute: () => rootRoute,
  path: '/create',
});

const listLabelRoute = createRoute({
  component: ListLabelPageDisabled,
  getParentRoute: () => rootRoute,
  path: '/list',
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  createLabelRoute,
  listLabelRoute,
]);

export function createAppRouter(history?: RouterHistory): AnyRouter {
  return createRouter({ history, routeTree });
}

// For tests convenience
export function createMemoryAppRouter(
  initialEntries: string[] = ['/'],
): AnyRouter {
  const history = createMemoryHistory({ initialEntries });
  return createAppRouter(history);
}

export { RouterProvider };
