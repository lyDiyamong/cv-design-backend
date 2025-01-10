import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  create(createSectionDto: CreateSectionDto) {
    return 'This action adds a new section';
  }

  findAll() {
    return `This action returns all section`;
  }

  findOne(id: string) {
    return `This action returns a #${id} section`;
  }

  update(id: string, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: string) {
    return `This action removes a #${id} section`;
  }
}
