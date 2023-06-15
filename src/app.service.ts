/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "typeorm";
import { contacts } from "./contact.entity";
import { ContactRo, ResponseRo } from "./types/response.ro";
import { IContact, Precedence } from "./types/contact";
import { identificationDto } from "./dtos/identification.dto";

@Injectable()
export class AppService {
  constructor(@Inject(Connection) private connection: Connection) { }

  async getHello(): Promise<any> {
  return 'Welcome to Bitespeed.'
  }

  //identify Service
  async identifyService(identificationBody: identificationDto): Promise<ResponseRo<ContactRo>> {

    // Get access to contact table in DB.
    const contactRepo = await this.connection.getRepository(contacts);

    const response: ContactRo = {
      primaryContactId: null,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    };

    //Get contact which satisfy any condition either email or phoneNumber
    const findContact: IContact = await contactRepo.findOne({
      where: [
        { phoneNumber: identificationBody?.phoneNumber },
        { email: identificationBody?.email },
      ],
    });

    if (findContact) {

      //getting record which satisfy only email (phone and mobile are exist but in diffrent records)
      const emailContactCheck = await contactRepo.findOne({
        where: { email: identificationBody.email },
      });
      //getting record which satisfy only phoneNumber (phone and mobile are exist but in diffrent records)
      const phoneContactCheck = await contactRepo.findOne({
        where: { phoneNumber: identificationBody.phoneNumber },
      });


      //Query object to find all the secodary records associated with perticular primaryContacRecord
      const allQuery = {
        select: { id: true, phoneNumber: true, email: true },
        where: {},
      };

      if (
        emailContactCheck &&
        phoneContactCheck &&
        emailContactCheck?.id !== phoneContactCheck?.id
      ) {
        // if email and phone both are existing in db but in diffrent records.
        const emailContactCreatedAt = emailContactCheck.createdAt;
        const phoneContactCreatedAt = phoneContactCheck.createdAt;

        // Mark older contact as "secondary"
        if (emailContactCreatedAt < phoneContactCreatedAt) {
          allQuery.where["linkedId"] = emailContactCheck.id;
          response["primaryContactId"] = emailContactCheck.id;
          response.emails.push(emailContactCheck.email);
          response.phoneNumbers.push(emailContactCheck.phoneNumber);

          await contactRepo.update(
            { id: phoneContactCheck.id },
            { linkPrecedence: Precedence.SECONDARY, linkedId: emailContactCheck.id }
          );
        } else {
          allQuery.where["linkedId"] = phoneContactCheck.id;
          response["primaryContactId"] = phoneContactCheck.id;
          response.emails.push(phoneContactCheck.email);
          response.phoneNumbers.push(phoneContactCheck.phoneNumber);

          await contactRepo.update(
            { id: emailContactCheck.id },
            { linkPrecedence: Precedence.SECONDARY, linkedId: phoneContactCheck.id }
          );
        }
      } else {

        // check if the findUser is of type primary or secondary
        if (findContact?.linkPrecedence === Precedence.PRIMARY) {
          allQuery.where["linkedId"] = findContact.id;
          response["primaryContactId"] = findContact.id;
          response.emails.push(findContact.email);
          response.phoneNumbers.push(findContact.phoneNumber);
        }
        else {
          //If findContact is secondary then find primaray record associated with it.
          const findPrimaryUse: IContact = await contactRepo.findOne({
            where: { id: findContact.linkedId },
          });
          allQuery.where["linkedId"] = findPrimaryUse.id;

          response["primaryContactId"] = findPrimaryUse.id;
          response.emails.push(findPrimaryUse.email);
          response.phoneNumbers.push(findPrimaryUse.phoneNumber);
        }
      }

      // find all the contact associated with perticular secondry records id .
      const result: any = await contactRepo.find(allQuery);

      if (result.length === 0) {
        // if no secondary records found , insert it in DB.
        const insertSecondaryRecord = await contactRepo.insert({
          email: identificationBody.email,
          phoneNumber: identificationBody.phoneNumber,
          linkedId: findContact.id,
          linkPrecedence: Precedence.SECONDARY,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          contact: {
            primaryContactId: findContact.id,
            emails: [...new Set([findContact.email, identificationBody.email])],
            phoneNumbers: [
              ...new Set([
                findContact.phoneNumber,
                identificationBody.phoneNumber,
              ]),
            ],
            secondaryContactIds: [insertSecondaryRecord.identifiers[0].id],
          },
        };
      }

      // loop through all the records of "result" variable to create
      for (let i = 0; i <= result.length - 1; i++) {
        if (!response.emails.find((elm) => elm === result[i].email))
          response.emails.push(result[i].email);

        if (!response.phoneNumbers.find((elm) => elm === result[i].phoneNumber))
          response.phoneNumbers.push(result[i].phoneNumber);

        if (!response.secondaryContactIds.find((elm) => elm === result[i].id))
          response.secondaryContactIds.push(result[i].id);
      }

    } else {
      // Nither email nor phoneNumber exist in db , then insert new record.
      const insertRecord = {
        phoneNumber: identificationBody?.phoneNumber || null,
        email: identificationBody?.email || null,
        linkPrecedence: Precedence.PRIMARY,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertedRecord: any = await contactRepo.insert(insertRecord);
      response["primaryContactId"] = insertedRecord.identifiers[0].id;
      if (insertRecord.email !== null)
        response.emails.push(insertRecord?.email);
      if (insertRecord.phoneNumber !== null)
        response.phoneNumbers.push(insertRecord?.phoneNumber);
    }
    return { contact: response }; // Returns result
  }
}
