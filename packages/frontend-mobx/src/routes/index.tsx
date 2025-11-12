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

import HeaderView from '../components/views/Header/HeaderView';
import { useRouter } from '../hooks/useRouter';
import { i18n } from '../i18n';
import { UrlSearchSchema } from '../validation/schema';
import CreateLabelRoute from './CreateLabelRoute/CreateLabelRoute';
import EditLabelRoute from './EditLabelRoute/EditLabelRoute';
import HomePageRoute from './HomePage/HomePageRoute';
import ListLabelRoute from './ListLabelRoute/ListLabelRoute';

const IS_DEMO_MODE = import.meta.env?.VITE_DEMO_MODE === 'true';

export type RouterContext = {
  getIsHome?: () => boolean;
  getTitle?: () => string;
};

export const APPLICATION_NAME = 'Freedom Label';

function Layout({ children }: PropsWithChildren) {
  const { isHome, title } = useRouter();

  return (
    <div className="app-container">
      <HeaderView isHome={isHome} title={title} />
      <main className="app-main" role="main">
        {children}
      </main>
    </div>
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

export const Paths = {
  create: '/create',
  edit: '/edit/$id',
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
  component: HomePageRoute,
  getParentRoute: () => rootRoute,
  path: Paths.home,
});

const createLabelRoute = createRoute({
  beforeLoad: () => {
    const baseTitle = i18n.t('createLabel');
    const demoTitle = IS_DEMO_MODE ? ` (${String(i18n.t('demoMode'))})` : '';
    const title = `${baseTitle}${demoTitle}`;

    return {
      getTitle: () => title,
    };
  },
  component: CreateLabelRoute,
  getParentRoute: () => rootRoute,
  path: Paths.create,
});

const editLabelRoute = createRoute({
  beforeLoad: () => {
    return {
      getTitle: () => i18n.t('editLabel'),
    };
  },
  component: EditLabelRoute,
  getParentRoute: () => rootRoute,
  path: Paths.edit,
});

const listLabelRoute = createRoute({
  beforeLoad: () => {
    return {
      getTitle: () => i18n.t('labelsList'),
    };
  },
  component: ListLabelRoute,
  getParentRoute: () => rootRoute,
  path: Paths.list,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  createLabelRoute,
  editLabelRoute,
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
