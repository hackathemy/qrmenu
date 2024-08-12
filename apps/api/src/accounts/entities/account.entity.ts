import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '@hackathon/type';

/** 회원 (계정) */
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    array: true,
    enum: Role,
    type: 'enum',
    default: [Role.SELLER],
    comment: '해당 계정의 권환 seller or admin',
  })
  roles: Role[];

  /** 이메일 */
  @Column({ comment: '이메일' })
  email: string;

  @Column({ nullable: true, comment: '전화번호' })
  phoneNumber: string | null;

  /** 비밀번호 */
  @Column({ length: 1000, comment: '비밀번호' })
  password: string;

  /** 가입일 */
  @CreateDateColumn({ comment: '가입일시' })
  createdAt: Date;

  @Column({ nullable: true })
  refreshToken: string | null;

  /** 삭제 여부(일시) */
  @DeleteDateColumn({ comment: '삭제 일시(여부)' })
  deletedAt: Date | null;
}
