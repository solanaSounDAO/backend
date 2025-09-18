import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Music } from '../entities/music.entity';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';

@Module({
  imports: [TypeOrmModule.forFeature([Music])], // Music 엔티티 등록
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService], // 다른 모듈에서도 사용할 수 있게
})
export class MusicModule {}
