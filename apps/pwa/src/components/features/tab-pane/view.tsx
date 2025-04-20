import { Tabs, Tab } from '@nextui-org/tabs';
import { useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import { PropsWithChildren } from 'react';

import { pages } from '~/shared/constants/pages';

export const TabPane = (props: PropsWithChildren) => {
  const { pathname } = useLocation();

  return (
    <div className="flex items-end gap-2 fixed bottom-0 left-0 w-full p-2">
      <div className="flex-grow">
        <Tabs fullWidth selectedKey={pathname} color="primary" placement="bottom" size="lg" variant="bordered">
          <Tab
            key={pages.index}
            href={pages.index}
            title={<div dangerouslySetInnerHTML={{ __html: feather.icons.home.toSvg() }}></div>}
          />
          <Tab
            key={pages.peers}
            href={pages.peers}
            title={<div dangerouslySetInnerHTML={{ __html: feather.icons.users.toSvg() }}></div>}
          />
          <Tab
            key={pages.account}
            title={<div dangerouslySetInnerHTML={{ __html: feather.icons.user.toSvg() }}></div>}
          />
        </Tabs>
      </div>
      <div className="w-[80px]">{props.children}</div>
    </div>
  );
};
