import { MenuAllergy, MenuBadge, MenuFoodStyle } from '@hackathon/type';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuImage } from './menu-image.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { MenuCategory } from './menu-category.entity';
import { MenuOptionGroup } from './menu-option-group.entity';
import { MenuTranslate } from './menu-translate.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '비공개 여부' })
  isPrivate: boolean;

  @Column({ comment: '품절 여부' })
  isSoldOut: boolean;

  @Column({ array: true, type: 'enum', enum: MenuBadge, comment: '뱃지 목록' })
  badges: MenuBadge[];

  @Column({
    array: true,
    type: 'enum',
    enum: MenuFoodStyle,
    comment: '푸드스타일 목록',
  })
  foodStyles: MenuFoodStyle[];

  @Column({
    array: true,
    type: 'enum',
    enum: MenuAllergy,
    comment: '알러지 목록',
  })
  allergies: MenuAllergy[];

  @CreateDateColumn({ comment: '메뉴 생성 일시' })
  createdAt: Date;

  @ManyToOne(() => Seller, (s) => s)
  @JoinColumn({ referencedColumnName: 'id', name: 'seller_id' })
  seller: Seller;

  @Column({ comment: '메뉴 Owner' })
  sellerId: number;

  /** Joined */
  @OneToMany(() => MenuImage, (c) => c.menu)
  images: MenuImage[];

  @OneToMany(() => MenuCategory, (c) => c.menu)
  categories: MenuCategory[];

  @OneToMany(() => MenuOptionGroup, (c) => c.menu)
  optionGroups: MenuOptionGroup[];

  @OneToMany(() => MenuTranslate, (photo) => photo.menu)
  translates: MenuTranslate[];
  translate: MenuTranslate;
  translateKR: MenuTranslate;
}
