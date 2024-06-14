import { useController } from '../../lib/controller';

import { MainController } from './controller';

export const Main = () => {
  useController(MainController, {});

  return <div className="bg-background">Main</div>;
};
