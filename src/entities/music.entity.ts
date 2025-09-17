import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Music {
  @PrimaryGeneratedColumn('uuid')
  music_id: string;

  @Column()
  title: string; // 노래제목

  @Column()
  album: string; // 앨범이름

  @Column({ type: 'datetime' })
  release_date: Date; // 발매일

  @Column()
  genre: string; // 장르

  @Column({ type: 'int' }) // (mysql 기준)
  duration: number; // 노래길이 (ts)

  @Column()
  mp3_cid: string; // IPFS CID

  @Column()
  cover_image_cid: string; // 커버 이미지 CID

  @ManyToOne(() => User, (user) => user.music)
  @JoinColumn({ name: 'wallet_address' }) //Music 테이블의 wallet_address 컬럼으로 User와 연결해
  artist: User; //이 Music 객체의 artist속성으로 접근하면, User 객체를 가져올 수 있음

  @Column()
  wallet_address: string; // 아티스트 지갑 주소 (FK) //User PK가 특별한거라서.. 여기서도 명시적으로 선언해야함 ㅠㅠ
}
