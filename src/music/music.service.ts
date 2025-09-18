import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Music } from '../entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepository: Repository<Music>,
  ) {}

  // 음악 생성
  async createMusic(musicData: {
    title: string;
    album: string;
    release_date: Date;
    genre: string;
    duration: number;
    mp3_cid: string;
    cover_image_cid: string;
    wallet_address: string; //FK
    token_address: string;
    pool_address: string;
  }) {
    const music = this.musicRepository.create({
      ...musicData,
      play_count: 0,
      likes: 0,
    });
    return await this.musicRepository.save(music);
  }

  // 모든 음악 조회
  async findAll() {
    return await this.musicRepository.find({
      relations: ['artist'], // 아티스트 정보(User 객체로) 같이 가져오기
      order: { release_date: 'DESC' }, // 최신순
    });
  }

  // 특정 음악 조회
  async findOne(music_id: string) {
    const music = await this.musicRepository.findOne({
      where: { music_id },
      relations: ['artist'], //User 객체도 같이 가져옴
    });

    if (!music) {
      throw new NotFoundException('음악을 찾을 수 없습니다');
    }

    return music;
  }

  // 특정 아티스트의 음악들 조회
  async findByArtist(wallet_address: string) {
    return await this.musicRepository.find({
      where: { wallet_address },
      relations: ['artist'],
      order: { release_date: 'DESC' },
    });
  }

  // 장르별 음악 조회
  async findByGenre(genre: string) {
    return await this.musicRepository.find({
      where: { genre },
      relations: ['artist'],
      order: { release_date: 'DESC' },
    });
  }

  // 음악 정보 수정
  async updateMusic(music_id: string, updateData: {
      title?: string;
      album?: string;
      release_date?: Date;
      genre?: string;
      duration?: number;
      mp3_cid?: string; //음
      cover_image_cid?: string; //음
    }) {
    const music = await this.findOne(music_id);

    Object.assign(music, updateData); // music 객체에 updateData의 속성들 덮어씀
    return await this.musicRepository.save(music);
  }

  // 음악 삭제
  async deleteMusic(music_id: string) {
    const music = await this.findOne(music_id);

    await this.musicRepository.remove(music);
    return { message: '음악이 삭제되었습니다' };
  }

  // 음악 검색 (제목,앨범명,아티스트명 검색)
  async searchMusic(searchTerm: string) {
    return await this.musicRepository
      .createQueryBuilder('music')
      .leftJoinAndSelect('music.artist', 'artist')
      .where('music.title LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('music.album LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('artist.username LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('music.release_date', 'DESC')
      .getMany();
  }
}
