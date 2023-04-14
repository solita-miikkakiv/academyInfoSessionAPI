import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersReporsitory: Repository<User>,
  ) {}


  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log(createUserDto)
      const user = await this.usersReporsitory.create(createUserDto);
      return await this.usersReporsitory.save(user);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getLoginAmount(id: number): Promise<User> {
    try {
      return await this.usersReporsitory.findOne({ where: { id }});
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersReporsitory.findOne({where: {username}});
  }

  async incrementLoginCount(username: string) {
    await this.usersReporsitory.increment({ username }, 'loginCount', 1)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
