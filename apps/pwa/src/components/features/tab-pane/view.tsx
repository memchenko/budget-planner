import { observer } from 'mobx-react-lite';
import { Tabs, Tab } from '@nextui-org/tabs';
import { useLocation } from 'react-router-dom';
import feather from 'feather-icons';

import { TabPaneController } from './controller';
import { useController } from '~/shared/hooks/useController';
import { pages } from '~/shared/constants/pages';
import { MakeRecord } from '~/components/features/make-record';
import { PrimaryButton } from '~/components/ui/primary-button';

export const TabPane = observer(() => {
  const ctrl = useController(TabPaneController);
  const { pathname } = useLocation();

  return (
    <div className="flex items-end gap-2 fixed bottom-0 left-0 w-full p-2">
      {ctrl.isMakingRecord && <MakeRecord onFinish={ctrl.stopMakingRecord} />}

      {!ctrl.isMakingRecord && (
        <>
          <div className="flex-grow">
            <Tabs fullWidth selectedKey={pathname} color="primary" placement="bottom" size="lg" variant="bordered">
              <Tab
                key={pages.index}
                title={<div dangerouslySetInnerHTML={{ __html: feather.icons.home.toSvg() }}></div>}
              />
              <Tab
                key={pages.peers}
                title={<div dangerouslySetInnerHTML={{ __html: feather.icons.users.toSvg() }}></div>}
              />
              <Tab
                key={pages.account}
                title={<div dangerouslySetInnerHTML={{ __html: feather.icons.user.toSvg() }}></div>}
              />
            </Tabs>
          </div>
          <div className="w-1/6 aspect-square">
            <PrimaryButton
              isIconOnly
              size="lg"
              className="text-foreground w-full h-full rounded-full"
              onPress={ctrl.startMakingRecord}
            >
              <span dangerouslySetInnerHTML={{ __html: feather.icons.plus.toSvg() }}></span>
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
});
