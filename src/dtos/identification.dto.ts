/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class identificationDto { 

    @ApiProperty({ type: String, example: 'ravi31srv@gmail.com' })
    @IsOptional()
    @IsString()
    email? : string;

    @ApiProperty({ type: String, example: '8511092961' })
    @IsOptional()
    @IsString()
    phoneNumber? : string;
}