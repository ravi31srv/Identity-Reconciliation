/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class contacts {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    phoneNumber: string;
    
    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    linkedId: number;// the ID of another Contact linked to this one

    @Column()
    linkPrecedence: string; // "primary" if it's the first Contact in the link

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({ nullable: true })
    deletedAt: Date;
}

