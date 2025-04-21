import { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';
import feather from 'feather-icons';
import { Input } from '@nextui-org/input';
import { useController } from '~/shared/hooks/useController';
// import { useUnmount } from '~/shared/hooks/useUnmount';
import { Button } from '~/components/ui/button';

import { QRReaderController } from './controller';

export interface QrReaderProps extends PropsWithChildren<unknown> {
  onRead: (data: string) => void;
}

export const QrReader = observer(({ onRead }: QrReaderProps) => {
  const ctrl = useController(QRReaderController);
  ctrl.onRead = onRead;

  // useUnmount(ctrl.reset);

  return (
    <div className="flex flex-col gap-4 items-end sm:items-center">
      <div className="flex items-center w-full aspect-square sm:aspect-video sm:max-w-[900px] overflow-hidden justify-center bg-black">
        <video className="h-full max-w-none" ref={(elem) => ctrl.setVideoElement(elem)}></video>
      </div>
      <Button fullWidth as="label" className="relative overflow-hidden">
        <span dangerouslySetInnerHTML={{ __html: feather.icons.image.toSvg() }} />
        Choose from gallery
        <input
          type="file"
          accept="image/*"
          multiple={false}
          className="absolute w-px h-px -top-1 -right-1"
          onChange={ctrl.handleFileInputChange}
        />
      </Button>
      <Input fullWidth size="lg" label="Insert code" onChange={ctrl.handleInputChange} />
    </div>
  );
});
