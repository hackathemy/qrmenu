import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LangCode } from '@hackathon/type';
import { Menu } from './menu.entity';

@Entity()
export class MenuTranslate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Menu, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menu: Menu;

  @Column({ type: 'enum', enum: LangCode, comment: '언어코드' })
  langCode: LangCode;

  @Column({ comment: '언어별 메뉴명' })
  name: string;

  @Column({ type: 'text', comment: '언어별 메뉴 설명' })
  description: string;

  @Column({ type: 'text', comment: '언어별 메뉴 가이드' })
  guide: string;

  @Column({ array: true, type: 'varchar', comment: '언어별 재료 목록' })
  ingredients: string[];

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  translatedAt: Date | null;
}
