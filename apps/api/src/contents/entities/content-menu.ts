import { Menu } from 'src/menu/menus/entities/menu.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class ContentMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Content, (c) => c, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'content_id', referencedColumnName: 'id' })
  content: Content;

  @Column()
  contentId: number;

  @ManyToOne(() => Menu, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menu: Menu;

  @Column({ comment: 'contentId에 속한 menu' })
  menuId: number;
}
