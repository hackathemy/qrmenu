import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LangCode } from '@hackathon-qrmenu/type';
import { MenuOptionItem } from './menu-option-item.entity';

@Entity()
export class MenuOptionItemTranslate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuOptionItem, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_option_item_id', referencedColumnName: 'id' })
  item: MenuOptionItem;

  @Column({ type: 'enum', enum: LangCode, comment: '언어코드' })
  langCode: LangCode;

  @Column({ comment: '언어별 메뉴 옵션명' })
  name: string;
}
