import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Content } from './content.entity';
import { LangCode } from '@hackathon/type';

@Entity()
export class ContentTranslate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Content, (s) => s, { onDelete: 'CASCADE' })
  @JoinColumn({ referencedColumnName: 'id', name: 'content_id' })
  content: Content;

  @Column({})
  contentId: number;

  @Column({ comment: '언어별 컨텐츠 제목' })
  title: string;

  @Column({ type: 'text', comment: '언어별 컨텐츠 본문' })
  descriptionHtml: string;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  translatedAt: Date | null;

  @Column({ type: 'enum', enum: LangCode, comment: '언어코드' })
  langCode: LangCode;
}
