import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from 'src/files/entities/file.entity';
import { Account } from 'src/accounts/entities/account.entity';
import {
  PaymentCardType,
  PaymentCashType,
  PaymentSmartPayType,
  SellerType,
  UsageGuide,
} from '@hackathon-qrmenu/type';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false, comment: '상점 공개 여부' })
  visible: boolean;

  /** 식당명 */
  @Column({ comment: '식당명' })
  name: string;

  /** 식당 전화번호 */
  @Column({ comment: '식당 전화번호' })
  contact: string;

  /** 업종  */
  @Column({ type: 'enum', enum: SellerType, comment: '식당 업종' })
  type: SellerType;

  /** 담당자 전화번호 */
  @Column({ length: 20, comment: '담당자 전화번호' })
  managerPhoneNumber: string;

  /** 상호 */
  @Column({ comment: '상호' })
  companyName: string;

  /** 사업자번호 */
  @Column({ comment: '사업자 번호' })
  companyNumber: string;

  /** 사업자 등록증 */
  @OneToOne(() => File, (f) => f)
  @JoinColumn({
    name: 'company_number_image_file_id',
    referencedColumnName: 'id',
  })
  companyNumberImage: File;

  @Column({ comment: '사업자 등록증 이미지' })
  companyNumberImageFileId: number;

  @OneToOne(
    () => Account,
    (a) => ({
      email: a.email,
      phoneNumber: a.phoneNumber,
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
    }),
  )
  @JoinColumn({ name: 'account_id', referencedColumnName: 'id' })
  account: Account;

  @Column({ comment: '상점 소유 계정' })
  accountId: number;

  @Column({ comment: '대표자명' })
  ceoName: string;

  @Column({ comment: '대표자 연락처' })
  ceoPhoneNumber: string;

  @Column({ comment: '가게 주소' })
  address: string;

  @Column({ nullable: true, comment: '가게 오픈 시간' })
  openTime: string | null;

  @Column({ nullable: true, comment: 'WIFI SSID' })
  wifiSSID: string | null;

  @Column({ nullable: true, comment: 'WIFI KEY' })
  wifiKey: string | null;

  @Column({ nullable: true, comment: '선불제 여부' })
  prepayment: boolean | null;

  @Column({
    type: 'enum',
    array: true,
    enum: UsageGuide,
    default: [],
    comment: '가이드 메뉴 노출 순서',
  })
  guideOrders: UsageGuide[];

  @Column({
    default: [],
    array: true,
    type: 'enum',
    enum: PaymentCashType,
    comment: '결제 유형 캐시 지원 목록',
  })
  paymentCashTypes: PaymentCashType[];

  @Column({
    default: [],
    array: true,
    type: 'enum',
    enum: PaymentCardType,
    comment: '결제 유형 카드 지원 목록',
  })
  paymentCardTypes: PaymentCardType[];

  @Column({
    default: [],
    array: true,
    type: 'enum',
    enum: PaymentSmartPayType,
    comment: '결제 유형 간편결제 지원 리스트',
  })
  paymentSmartPayTypes: PaymentSmartPayType[];

  @Column({ nullable: true, comment: '가이드 활성화 여부' })
  enabledPayment: boolean | null;

  @Column({ nullable: true, comment: '가이드 활성화 여부' })
  enabledWifi: boolean | null;

  @Column({ nullable: true, comment: '가이드 활성화 여부' })
  enabledToilet: boolean | null;

  @Column({ nullable: true, comment: '가이드 활성화 여부' })
  enabledKids: boolean | null;

  @Column({ nullable: true, comment: '가이드 활성화 여부' })
  enabledAccessibility: boolean | null;

  @Column({ nullable: true, comment: '가이드 활성화 여부' })
  enabledParking: boolean | null;

  @Column({
    comment: '가게 상세주소',
  })
  addressDetail: string;

  @CreateDateColumn({
    comment: '상점 등록일시',
  })
  createdAt: Date;
}
