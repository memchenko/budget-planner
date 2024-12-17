import { PropsWithChildren } from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from 'react-router-dom';
import { configurePersistable } from 'mobx-persist-store';
import localForage from 'localforage';
import { NextUIProvider } from '@nextui-org/react';
import './App.css';
import { Main } from '~/screens/main';
import { AddFund } from '~/screens/add-fund';
import { EditFund } from '~/screens/edit-fund';
import { P2PSynchronization } from '~/screens/p2p-synchronization';
import { ErrorBoundary } from '~/components/ErrorBoundary';
import { pages } from '~/shared/app/pages';

const NextUI = (props: PropsWithChildren<unknown>) => {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate}>
      <main className="dark">{props.children}</main>
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
            <Route path={pages.editFund} element={<EditFund />} />
            <Route path={pages.p2pSynchronization} element={<P2PSynchronization />} />
          </Routes>
        </ErrorBoundary>
      </NextUI>
    </BrowserRouter>
  );
}
