import { Seller } from 'src/sellers/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryTranslate } from './category-translate.entity';
import { MenuCategory } from 'src/menu/menus/entities/menu-category.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false ,comment:"비공개 여부"})
  isPrivate: boolean;

  @ManyToOne(() => Seller, (s) => s)
  @JoinColumn({ referencedColumnName: 'id', name: 'seller_id' })
  seller: Seller;

  @Column({ nullable: true,comment:"카테고리 노출 순서" })
  index: number;

  @CreateDateColumn({comment:"생성일시"})
  createdAt: Date;

  menuTotalSize: number;

  @OneToMany((c) => MenuCategory, (e) => e.category)
  menuCategories: MenuCategory[];

  @Column({comment:"카테고리 Owner"})
  sellerId: number;

  translate: CategoryTranslate;

  @OneToMany(() => CategoryTranslate, (photo) => photo.category)
  translates: CategoryTranslate[];
}
