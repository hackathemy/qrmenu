import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuOptionGroup } from './menu-option-group.entity';
import { MenuUnit } from '@hackathon-qrmenu/type';
import { MenuOptionItemTranslate } from './menu-option-item-translate.entity';

@Entity()
export class MenuOptionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuOptionGroup, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_option_group_id', referencedColumnName: 'id' })
  group: MenuOptionGroup;

  @Column({ comment: '옵션이 속한 항목' })
  menuOptionGroupId: number;

  @Column({ comment: '옵션 가격' })
  price: number;

  @Column({ comment: '옵션 중량' })
  weight: number;

  @Column({ type: 'enum', enum: MenuUnit, comment: '중량 단위' })
  unit: MenuUnit;

  @Column({ comment: '옵션 다중 선택 가능 여부' })
  quantityMultiple: boolean;

  @Column({ comment: '다중 선택 가능한 경우 최대 선택 수량' })
  quantityMax: number;

  @Column({ default: 0, comment: '옵션 노출 순서' })
  index: number;

  @OneToMany(() => MenuOptionItemTranslate, (photo) => photo.item)
  translates: MenuOptionItemTranslate[];
  translate: MenuOptionItemTranslate;
  translateKR: MenuOptionItemTranslate;
}
