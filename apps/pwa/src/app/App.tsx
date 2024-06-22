import { PropsWithChildren } from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import { configurePersistable } from 'mobx-persist-store';
import localForage from 'localforage';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import { Main } from '../screens/main';
import { AddFund } from '../screens/add-fund';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { pages } from '../lib/app/pages';

const NextUI = (props: PropsWithChildren<{}>) => {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <main className="dark text-foreground bg-background">{props.children}</main>
    </NextUIProvider>
  );
};

configurePersistable({
  storage: localForage,
  stringify: false,
});

export function App() {
  return (
    <BrowserRouter>
      <NextUI>
        <ErrorBoundary>
          <Routes>
            <Route path={pages.index} element={<Main />} />
            <Route path={pages.addFund} element={<AddFund />} />
          </Routes>
        </ErrorBoundary>
      </NextUI>
    </BrowserRouter>
  );
}
