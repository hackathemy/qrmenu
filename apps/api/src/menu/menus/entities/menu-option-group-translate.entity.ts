import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LangCode } from '@hackathon/type';
import { MenuOptionGroup } from './menu-option-group.entity';

@Entity()
export class MenuOptionGroupTranslate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuOptionGroup, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_option_group_id', referencedColumnName: 'id' })
  group: MenuOptionGroup;

  @Column({ type: 'enum', enum: LangCode, comment: '언어코드' })
  langCode: LangCode;

  @Column({ comment: '언어별 메뉴 항목명' })
  name: string;
}
