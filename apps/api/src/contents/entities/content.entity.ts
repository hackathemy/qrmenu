import { Seller } from 'src/sellers/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { ContentTranslate } from './content-translate.entity';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false, comment: '비공개 여부' })
  isPrivate: boolean;

  @Column({ default: false, comment: '고정 여부' })
  isPin: boolean;

  @Column({ default: 0, comment: '조회수' })
  views: number;

  @OneToOne(() => File, (f) => f)
  @JoinColumn({
    name: 'thumbnail_file_id',
    referencedColumnName: 'id',
  })
  thumbnail: File;

  @Column({ comment: '썸네일 Image' })
  thumbnailFileId: number;

  @ManyToOne(() => Seller, (s) => s)
  @JoinColumn({ referencedColumnName: 'id', name: 'seller_id' })
  seller: Seller;

  @Column({ comment: '컨텐츠 Owner' })
  sellerId: number;

  translate: ContentTranslate;

  @OneToMany(() => ContentTranslate, (photo) => photo.content)
  translates: ContentTranslate[];

  @CreateDateColumn({ comment: '생성일시' })
  createdAt: Date;
}
