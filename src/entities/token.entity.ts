import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Music } from './music.entity';

@Entity()
export class Token {
  @PrimaryColumn('uuid')
  music_id: string; // Music과 1:1 관계

  @Column()
  token_address: string; // 토큰 주소

  @Column()
  pool_address: string; // 풀 주소

  @Column({ type: 'int', default: 0 })
  play_count: number; // 재생수

  @Column({ type: 'int', default: 0 })
  likes: number; // 좋아요 수

  @OneToOne(() => Music)
  @JoinColumn({ name: 'music_id' })
  music: Music;
}
