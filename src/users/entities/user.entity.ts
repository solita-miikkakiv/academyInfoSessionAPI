import * as bcrypt from 'bcrypt';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { randomBytes } from 'crypto';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @IsString()
    @Column({
        nullable: false,
        unique: true
    })
    username: string;

    @IsString()
    @Column()
    password: string;

    @IsNumber()
    @Column({
        default: 0
    })
    loginCount: number;

    @IsBoolean()
    @Column({
        default: false,
        nullable: false
    })
    isAdmin: boolean

    async comparePasswords(pass: string): Promise<Boolean> {
        const user = this as User;
        return await bcrypt.compare(pass, user.password).catch((e) => false)
    }

    @BeforeInsert()
    @BeforeUpdate()
    async before(): Promise<void> {
        let user = this as User;

        if(user.password == null) {
            user.password = await new Promise((resolve) => {
                randomBytes(100, (err, buffer) => {
                    const token = buffer.toString('hex');
                    return resolve(token);
                })
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = bcrypt.hashSync(user.password, salt);

        this.password = hash;
    }

}
