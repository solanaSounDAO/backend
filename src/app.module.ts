import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Music } from './entities/music.entity';
import { Token } from './entities/token.entity';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든지 import 없이 사용 가능
      envFilePath: '.env', // 환경 변수 파일 경로
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME, // 사용자 이름
      password: process.env.DB_PASSWORD, // 비밀번호
      database: process.env.DB_NAME, // 데이터베이스 이름
      entities: [User, Music, Token], // 엔티티 파일 경로
      synchronize: true, // 개발 환경에서만 사ㄷ용, 실제 운영 환경에서는 false로 설정
      logging: true, // 쿼리 로깅 활성화
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
