import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 사용자 생성
  async createUser(userData: {
    wallet_address: string;
    username: string;
    profile?: string;
    background?: string;
  }) {
    // 이미 존재하는 지갑 주소인지 확인
    const existingUser = await this.userRepository.findOne({
      where: { wallet_address: userData.wallet_address }
    });

    if (existingUser) {
      throw new ConflictException('이미 등록된 지갑 주소입니다');
    }

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  // 모든 사용자 조회
  async findAll() {
    return await this.userRepository.find({
      relations: ['music'], // 사용자가 만든 음악도 같이 join
    });
  }

  // 지갑 주소로 사용자 조회
  async findOne(wallet_address: string) {
    const user = await this.userRepository.findOne({
      where: { wallet_address },
      relations: ['music'],
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다');
    }

    return user;
  }

  // 사용자 정보 수정
  async updateUser(wallet_address: string, updateData: {
    username?: string;
    profile?: string;
    background?: string;
  }) {
    const user = await this.findOne(wallet_address);

    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  // 사용자 삭제
  async deleteUser(wallet_address: string) {
    const user = await this.findOne(wallet_address);

    await this.userRepository.remove(user);
    return { message: '사용자가 삭제되었습니다' };
  }
}
