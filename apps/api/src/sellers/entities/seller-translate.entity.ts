import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Seller } from './seller.entity';
import { LangCode } from '@hackathon-qrmenu/type';

@Entity()
export class SellerTranslate {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seller, (s) => s)
  @JoinColumn({ referencedColumnName: 'id', name: 'seller_id' })
  seller: Seller;

  @Column({ comment: '언어별 상점명' })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  nameTranslatedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  nameUpdatedAt: Date | null;

  @Column({ type: 'text', comment: '언어별 소개글' })
  introductionHtml: string;

  @Column({ type: 'timestamp', nullable: true })
  introductionHtmlTranslatedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  introductionHtmlUpdatedAt: Date | null;

  @Column({ type: 'text', default: '', comment: '언어별 가이드 화장실 설명글' })
  toiletHtml: string;
  @Column({ type: 'timestamp', nullable: true })
  toiletHtmlTranslatedAt: Date | null;
  @Column({ type: 'timestamp', nullable: true })
  toiletHtmlUpdatedAt: Date | null;

  @Column({ type: 'text', default: '', comment: '언어별 가이드 kids 설명글' })
  kidsHtml: string;
  @Column({ type: 'timestamp', nullable: true })
  kidsHtmlTranslatedAt: Date | null;
  @Column({ type: 'timestamp', nullable: true })
  kidsHtmlUpdatedAt: Date | null;

  @Column({
    type: 'text',
    default: '',
    comment: '언어별 가이드 accessibility 설명글',
  })
  accessibilityHtml: string;
  @Column({ type: 'timestamp', nullable: true })
  accessibilityHtmlTranslatedAt: Date | null;
  @Column({ type: 'timestamp', nullable: true })
  accessibilityHtmlUpdatedAt: Date | null;

  @Column({
    type: 'text',
    default: '',
    comment: '언어별 가이드 parking 설명글',
  })
  parkingHtml: string;
  @Column({ type: 'timestamp', nullable: true })
  parkingHtmlTranslatedAt: Date | null;
  @Column({ type: 'timestamp', nullable: true })
  parkingHtmlUpdatedAt: Date | null;

  @Column({
    comment: '언어별 주소',
  })
  address: string;

  @Column({
    comment: '언어별 상세 주소',
  })
  addressDetail: string;

  @Column({ type: 'enum', enum: LangCode, comment: '언어 코드' })
  langCode: LangCode;
}
