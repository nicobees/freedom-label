import { useRouterState } from '@tanstack/react-router';

import { APPLICATION_NAME } from '../routes';

export const useRouter = () => {
  const matches = useRouterState({ select: (s) => s.matches });
  const titleProvider = [...matches].reverse().find((m) => m.context.getTitle);
  const title = titleProvider?.context?.getTitle?.() ?? APPLICATION_NAME;

  const isHomeProvider = [...matches]
    .reverse()
    .find((m) => m.context.getIsHome);
  const isHome = !!isHomeProvider?.context?.getIsHome?.();

  return { isHome, title };
};
