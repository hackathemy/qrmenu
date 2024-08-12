import { Category } from 'src/menu/categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class MenuCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, comment: '메뉴가 포함된 카테고리 내에서 노출 순서' })
  index: number;

  @ManyToOne(() => Category, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @Column({ comment: '메뉴가 포함된 카테고리' })
  categoryId: number;

  @ManyToOne(() => Menu, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menu: Menu;

  @Column()
  menuId: number;
}
