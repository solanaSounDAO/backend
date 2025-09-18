import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // User 엔티티 등록
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 다른 모듈에서도 사용할 수 있게
})
export class UsersModule {}
