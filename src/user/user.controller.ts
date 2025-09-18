import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '모든 사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자 목록을 성공적으로 조회했습니다.' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':wallet_address')
  @ApiOperation({ summary: '특정 사용자 조회' })
  @ApiParam({ name: 'wallet_address', description: '조회할 사용자의 지갑 주소', example: '0x1234567890abcdef' })
  @ApiResponse({ status: 200, description: '사용자 정보를 성공적으로 조회했습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  async findOne(@Param('wallet_address') wallet_address: string) {
    return await this.usersService.findOne(wallet_address);
  }

  @Post()
  @ApiOperation({ summary: '사용자 등록', description: '새로운 사용자를 등록합니다. 프로필/배경 이미지는 선택사항입니다.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['wallet_address', 'username'],
      properties: {
        wallet_address: { type: 'string', description: '지갑 주소', example: '0x1234567890abcdef' },
        username: { type: 'string', description: '사용자 이름', example: '홍길동' },
        profile: { type: 'string', format: 'binary', description: '프로필 이미지 (선택)' },
        background: { type: 'string', format: 'binary', description: '배경 이미지 (선택)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: '사용자가 성공적으로 등록되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile', maxCount: 1 },
        { name: 'background', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'profile') {
              cb(null, './uploads/profiles');
            } else {
              cb(null, './uploads/backgrounds');
            }
          },
          filename: (req, file, cb) => {
            const name = file.originalname.split('.')[0];
            const extension = extname(file.originalname);
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            cb(null, `${name}_${randomName}${extension}`);
          },
        }),
      },
    ),
  )
  async createUser(
    @Body() userData: { wallet_address: string; username: string },
    @UploadedFiles() files: {
      profile?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    const profilePath = files?.profile ? files.profile[0].path : null;
    const backgroundPath = files?.background ? files.background[0].path : null;

    return await this.usersService.createUser({
      ...userData,
      profile: profilePath,
      background: backgroundPath,
    });
  }

  @Put(':wallet_address')
  @ApiOperation({ summary: '사용자 정보 수정', description: '기존 사용자 정보를 수정합니다.' })
  @ApiParam({ name: 'wallet_address', description: '수정할 사용자의 지갑 주소', example: '0x1234567890abcdef' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: '변경할 사용자 이름 (선택)', example: '김철수' },
        profile: { type: 'string', format: 'binary', description: '변경할 프로필 이미지 (선택)' },
        background: { type: 'string', format: 'binary', description: '변경할 배경 이미지 (선택)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: '사용자 정보가 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  async updateUser(
    @Param('wallet_address') wallet_address: string,
    @Body() updateData: { username?: string },
    @UploadedFiles() files: { 
      profile?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    const profilePath = files?.profile ? files.profile[0].path : undefined;
    const backgroundPath = files?.background ? files.background[0].path : undefined;

    return await this.usersService.updateUser(wallet_address, {
      ...updateData,
      ...(profilePath && { profile: profilePath }),
      ...(backgroundPath && { background: backgroundPath }),
    });
  }

  @Delete(':wallet_address')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiParam({ name: 'wallet_address', description: '삭제할 사용자의 지갑 주소', example: '0x1234567890abcdef' })
  @ApiResponse({ status: 200, description: '사용자가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  async deleteUser(@Param('wallet_address') wallet_address: string) {
    return await this.usersService.deleteUser(wallet_address);
  }
}
