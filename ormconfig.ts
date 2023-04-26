import { ConfigModule } from '@nestjs/config';
import ormConfigMaster from './src/oem/config/orm-master.config';

ConfigModule.forRoot({
  isGlobal: true,
  load: [ormConfigMaster],
});

export default ormConfigMaster();
