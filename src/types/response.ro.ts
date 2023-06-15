/* eslint-disable prettier/prettier */
export class ResponseRo<T> {
    contact: T
}


export class ContactRo {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];

}