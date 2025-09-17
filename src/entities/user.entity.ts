import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Music } from './music.entity';

@Entity()
export class User {
  @PrimaryColumn()
  wallet_address: string; // 지갑주소가 PK

  @Column()
  username: string; // 겹쳐도 상관없음

  @Column({ nullable: true })
  profile: string; // 프로필 이미지 파일 경로

  @Column({ nullable: true })
  background: string; // 배경 이미지 파일 경로

  @CreateDateColumn()
  created_at: Date; // 자동으로 현재 시간

  @OneToMany(() => Music, (music) => music.artist)
  music: Music[];
}
