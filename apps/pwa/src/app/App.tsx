import { PropsWithChildren, useEffect, useCallback } from 'react';
import { useNavigate, generatePath, BrowserRouter, Route, Routes } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { configurePersistable } from 'mobx-persist-store';
import localForage from 'localforage';
import './App.css';
import { Main } from '~/components/screens/main';
import { AddFund } from '~/components/screens/add-fund';
import { EditFund } from '~/components/screens/edit-fund';
import { Connection } from '~/components/screens/connection';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { pages } from '~/shared/constants/pages';
import { setup } from './inversify.config';

configurePersistable({
  storage: localForage,
  stringify: false,
});

const NextUI = (props: PropsWithChildren<unknown>) => {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <main className="dark">{props.children}</main>
    </NextUIProvider>
  );
};

const Dependencies = (props: PropsWithChildren<unknown>) => {
  const baseNavigate = useNavigate();
  const navigate = useCallback(
    (route: string, params?: Record<string, unknown>) => {
      baseNavigate(generatePath(route, params));
    },
    [baseNavigate],
  );

  useEffect(() => {
    setup({ navigate });
  }, [navigate]);

  return props.children;
};

export function App() {
  return (
    <BrowserRouter>
      <NextUI>
        <Dependencies>
          <ErrorBoundary>
            <Routes>
              <Route path={pages.index} Component={Main} />
              <Route path={pages.addFund} Component={AddFund} />
              <Route path={pages.editFund} Component={EditFund} />
              <Route path={pages.connection} Component={Connection} />
            </Routes>
          </ErrorBoundary>
        </Dependencies>
      </NextUI>
    </BrowserRouter>
  );
}
