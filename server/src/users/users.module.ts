import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserController } from "./user.controller";
import { UsersService } from "./users.service";

@Module({
    controllers: [UserController],
    imports: [PrismaModule],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {
}
