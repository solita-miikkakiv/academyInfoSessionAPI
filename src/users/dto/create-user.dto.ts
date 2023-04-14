import { IsBoolean, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    username: string

    @IsString()
    @MinLength(6)
    password: string

    @IsBoolean()
    isAdmin: boolean
}
