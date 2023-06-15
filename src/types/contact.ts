/* eslint-disable prettier/prettier */

export interface IContact {
    id: number;
    phoneNumber?: string
    email?: string
    linkedId?: number; // the ID of another Contact linked to this one
    linkPrecedence: string //"secondary" | "primary" // "primary" if it's the first Contact in the link
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export enum Precedence  {
   PRIMARY = "primary",
    SECONDARY="secondary"
}