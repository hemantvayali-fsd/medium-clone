import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from '@tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig.options), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
