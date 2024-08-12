import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { MenuOptionGroupTranslate } from './menu-option-group-translate.entity';
import { MenuOptionItem } from './menu-option-item.entity';

@Entity()
export class MenuOptionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Menu, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menu: Menu;

  @Column({ comment: '필수 항목 여부' })
  isRequired: boolean;

  @Column({ comment: '무료 항목 여부' })
  isFree: boolean;

  @Column({ default: 0, comment: '항목 노출 순서' })
  index: number;

  @Column({ default: false, comment: '기본 항목 여부' })
  isDefault: boolean;

  @OneToMany(() => MenuOptionItem, (c) => c.group)
  items: MenuOptionItem[];

  @OneToMany(() => MenuOptionGroupTranslate, (photo) => photo.group)
  translates: MenuOptionGroupTranslate[];
  translate: MenuOptionGroupTranslate;
  translateKR: MenuOptionGroupTranslate;
}
