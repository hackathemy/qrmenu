import { Account } from 'src/accounts/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  /** S3 Object Accessor Key */
  @Column({ comment: 'S3 Object Accessor Key' })
  key: string;

  /** File Size */
  @Column({ comment: 'File Size' })
  size: number;

  /** File Name */
  @Column({ comment: 'File Name ' })
  fileName: string;

  /** File Type */
  @Column({ comment: 'File MimeType' })
  contentType: string;

  @ManyToOne(() => Account, (a) => ({ id: a.id }))
  @JoinColumn({ name: 'creatted_by_account_id', referencedColumnName: 'id' })
  createdBy: Account;

  @CreateDateColumn()
  createdAt: Date;
}
