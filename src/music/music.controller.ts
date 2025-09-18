import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  @ApiOperation({ summary: '음악 생성', description: '새로운 음악을 등록합니다.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'album', 'release_date', 'genre', 'duration', 'mp3_cid', 'cover_image_cid', 'wallet_address', 'token_address', 'pool_address'],
      properties: {
        title: { type: 'string', description: '음악 제목', example: 'Bohemian Rhapsody' },
        album: { type: 'string', description: '앨범명', example: 'A Night at the Opera' },
        release_date: { type: 'string', format: 'date', description: '발매일 (YYYY-MM-DD)', example: '2024-01-01' },
        genre: { type: 'string', description: '장르', example: 'Rock' },
        duration: { type: 'number', description: '재생 시간(초)', example: 354 },
        mp3_cid: { type: 'string', description: 'IPFS MP3 파일 CID', example: 'QmXxx...' },
        cover_image_cid: { type: 'string', description: 'IPFS 커버 이미지 CID', example: 'QmYyy...' },
        wallet_address: { type: 'string', description: '아티스트 지갑 주소', example: '0x1234567890abcdef' },
        token_address: { type: 'string', description: '토큰 컨트랙트 주소', example: '0xabc...' },
        pool_address: { type: 'string', description: '유동성 풀 주소', example: '0xdef...' },
      },
    },
  })
  @ApiResponse({ status: 201, description: '음악이 성공적으로 등록되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  async createMusic(@Body() musicData: {
    title: string;
    album: string;
    release_date: string;
    genre: string;
    duration: number;
    mp3_cid: string;
    cover_image_cid: string;
    wallet_address: string;
    token_address: string;
    pool_address: string;
  }) {
    return await this.musicService.createMusic({
      ...musicData,
      release_date: new Date(musicData.release_date), // Date 객체로 변환
    });
  }

  @Get()
  @ApiOperation({ summary: '모든 음악 조회' })
  @ApiResponse({ status: 200, description: '음악 목록을 성공적으로 조회했습니다.' })
  async findAll() {
    return await this.musicService.findAll();
  }

  @Get(':music_id')
  @ApiOperation({ summary: '특정 음악 조회' })
  @ApiParam({ name: 'music_id', description: '조회할 음악 ID', example: 'uuid-123' })
  @ApiResponse({ status: 200, description: '음악 정보를 성공적으로 조회했습니다.' })
  @ApiResponse({ status: 404, description: '음악을 찾을 수 없습니다.' })
  async findOne(@Param('music_id') music_id: string) {
    return await this.musicService.findOne(music_id);
  }

  @Get('artist/:wallet_address')
  @ApiOperation({ summary: '특정 아티스트의 음악 조회', description: '지갑 주소로 특정 아티스트의 모든 음악을 조회합니다.' })
  @ApiParam({ name: 'wallet_address', description: '아티스트 지갑 주소', example: '0x1234567890abcdef' })
  @ApiResponse({ status: 200, description: '아티스트의 음악 목록을 성공적으로 조회했습니다.' })
  async findByArtist(@Param('wallet_address') wallet_address: string) {
    return await this.musicService.findByArtist(wallet_address);
  }

  @Get('genre/:genre')
  @ApiOperation({ summary: '장르별 음악 조회' })
  @ApiParam({ name: 'genre', description: '조회할 장르', example: 'Rock' })
  @ApiResponse({ status: 200, description: '해당 장르의 음악 목록을 성공적으로 조회했습니다.' })
  async findByGenre(@Param('genre') genre: string) {
    return await this.musicService.findByGenre(genre);
  }

  @Put(':music_id')
  @ApiOperation({ summary: '음악 정보 수정' })
  @ApiParam({ name: 'music_id', description: '수정할 음악 ID', example: 'uuid-123' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: '음악 제목', example: 'Bohemian Rhapsody' },
        album: { type: 'string', description: '앨범명', example: 'A Night at the Opera' },
        release_date: { type: 'string', format: 'date', description: '발매일 (YYYY-MM-DD)', example: '2024-01-01' },
        genre: { type: 'string', description: '장르', example: 'Rock' },
        duration: { type: 'number', description: '재생 시간(초)', example: 354 },
        mp3_cid: { type: 'string', description: 'IPFS MP3 파일 CID', example: 'QmXxx...' },
        cover_image_cid: { type: 'string', description: 'IPFS 커버 이미지 CID', example: 'QmYyy...' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '음악 정보가 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '음악을 찾을 수 없습니다.' })
  async updateMusic(
    @Param('music_id') music_id: string,
    @Body() updateData: {
      title?: string;
      album?: string;
      release_date?: string;
      genre?: string;
      duration?: number;
      mp3_cid?: string;
      cover_image_cid?: string;
    }
  ) {
    const processedData = {
      ...updateData,
      ...(updateData.release_date && {
        release_date: new Date(updateData.release_date)
      })
    };

    return await this.musicService.updateMusic(music_id, processedData);
  }

  @Delete(':music_id')
  @ApiOperation({ summary: '음악 삭제' })
  @ApiParam({ name: 'music_id', description: '삭제할 음악 ID', example: 'uuid-123' })
  @ApiResponse({ status: 200, description: '음악이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '음악을 찾을 수 없습니다.' })
  async deleteMusic(@Param('music_id') music_id: string) {
    return await this.musicService.deleteMusic(music_id);
  }

  @Get('search')
  @ApiOperation({ summary: '음악 검색', description: '제목, 앨범, 장르로 음악을 검색합니다.' })
  @ApiQuery({ name: 'q', description: '검색어', required: false, example: 'Bohemian' })
  @ApiResponse({ status: 200, description: '검색 결과를 반환합니다.' })
  async searchMusic(@Query('q') searchTerm: string) {
    if (!searchTerm) {
      return [];
    }
    return await this.musicService.searchMusic(searchTerm);
  }
}
