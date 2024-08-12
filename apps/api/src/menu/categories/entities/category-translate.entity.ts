import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { LangCode } from '@hackathon-qrmenu/type';

@Entity()
export class CategoryTranslate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (s) => s, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: 'id', name: 'category_id' })
  category: Category;

  @Column({ comment: '언어별 카테고리명' })
  name: string;

  @Column({ type: 'enum', enum: LangCode, comment: '언어코드' })
  langCode: LangCode;
}
