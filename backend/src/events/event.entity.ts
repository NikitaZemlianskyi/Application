import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  dateTime: Date;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ type: 'int', nullable: true })
  capacity: number | null;

  @Column({
    type: 'enum',
    enum: EventVisibility,
    default: EventVisibility.PUBLIC,
  })
  visibility: EventVisibility;

  @ManyToOne(() => User, (user) => user.organizedEvents, { eager: true })
  organizer: User;

  @ManyToMany(() => User, (user) => user.participatingEvents)
  @JoinTable({
    name: 'participants',
    joinColumn: { name: 'eventId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  participants: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
