import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Album } from '@/album/album.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'album_id', type: 'char', length: 36, nullable: false })
  albumId: string;

  @ManyToOne(() => Album, { nullable: false })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @Column({ type: 'varchar', length: 200, nullable: false })
  content: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: false })
  createdAt: Date;
}
