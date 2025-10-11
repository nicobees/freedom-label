import type { PropsWithChildren } from 'react';

import { createMemoryHistory, type RouterHistory } from '@tanstack/history';
import {
  type AnyRouter,
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  retainSearchParams,
  RouterProvider,
} from '@tanstack/react-router';

import Header from '../components/Header/Header';
import { useLabelLocalStorage } from '../hooks/useLabelLocalStorage';
import { i18n } from '../i18n';
import { UrlSearchSchema } from '../validation/schema';
import CreateLabelPage from './CreateLabelPage/CreateLabelPage';
import HomePage from './HomePage/HomePage';

export type RouterContext = {
  getIsHome?: () => boolean;
  getTitle?: () => string;
};

export const APPLICATION_NAME = 'Freedom Label';

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
  const { getLabels } = useLabelLocalStorage();

  const labelsData = getLabels();

  return (
    <section>
      <h2 aria-hidden="true">List Label</h2>
      <p title="Not available yet">Not available yet</p>

      <ol>
        {labelsData.map((label) => {
          const { hash, payload, timestamp } = label;

          const formattedData = new Date(timestamp).toISOString();
          const dataToShow = `${payload.patient_info.name} ${payload.patient_info.surname} - ${payload.description} (${formattedData})`;
          return <li key={hash}>{dataToShow}</li>;
        })}
      </ol>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section>
      <h2>Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </section>
  );
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: NotFoundPage,
  search: {
    middlewares: [retainSearchParams(true)], // preserves ALL search params
  },
  validateSearch: UrlSearchSchema,
});

const Paths = {
  create: '/create',
  home: '/',
  list: '/list',
} as const;
type Paths = (typeof Paths)[keyof typeof Paths];

const homeRoute = createRoute({
  beforeLoad: () => {
    return {
      getIsHome: () => true,
      getTitle: () => i18n.t('home'),
    };
  },
  component: HomePage,
  getParentRoute: () => rootRoute,
  path: Paths.home,
});

const createLabelRoute = createRoute({
  beforeLoad: () => {
    return {
      getTitle: () => i18n.t('createLabel'),
    };
  },
  component: CreateLabelPage,
  getParentRoute: () => rootRoute,
  path: Paths.create,
});

const listLabelRoute = createRoute({
  beforeLoad: () => {
    return {
      getTitle: () => i18n.t('labelsList'),
    };
  },
  component: ListLabelPageDisabled,
  getParentRoute: () => rootRoute,
  path: Paths.list,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  createLabelRoute,
  listLabelRoute,
]);

function createAppRouter(history?: RouterHistory) {
  return createRouter({ history, routeTree });
}

export const router = createAppRouter();

// Register the router type globally for TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export { RouterProvider };

// For tests convenience
export function createMemoryAppRouter(
  initialEntries: string[] = ['/'],
): AnyRouter {
  const history = createMemoryHistory({ initialEntries });
  return createAppRouter(history);
}
