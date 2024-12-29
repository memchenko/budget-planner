import { PropsWithChildren } from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { configurePersistable } from 'mobx-persist-store';
import localForage from 'localforage';
import './App.css';
import { Main } from '~/components/screens/main';
import { AddFund } from '~/components/screens/add-fund';
import { EditFund } from '~/components/screens/edit-fund';
import { P2PSynchronization } from '~/components/screens/p2p-synchronization';
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

setup();

export function App() {
  return (
    <BrowserRouter>
      <NextUI>
        <ErrorBoundary>
          <Routes>
            <Route path={pages.index} Component={Main} />
            <Route path={pages.addFund} Component={AddFund} />
            <Route path={pages.editFund} Component={EditFund} />
            <Route path={pages.p2pSynchronization} Component={P2PSynchronization} />
          </Routes>
        </ErrorBoundary>
      </NextUI>
    </BrowserRouter>
  );
}
