import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Menu } from './menu.entity';
import { File } from 'src/files/entities/file.entity';

@Entity()
export class MenuImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Menu, (m) => m, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id', referencedColumnName: 'id' })
  menu: Menu;

  @OneToOne(() => File, (f) => f)
  @JoinColumn({
    name: 'image_file_id',
    referencedColumnName: 'id',
  })
  image: File;

  @Column({ comment: '메뉴 이미지 노출 순서' })
  index: number;
}
