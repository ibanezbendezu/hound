import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtPayload, User } from "../../shared";

@Injectable()
export class JwtAuthService {
    constructor(private jwtService: JwtService) {
    }

    login(user: User) {
        const { id, displayName, photos, username, email } = user;
        const payload: JwtPayload = {
            sub: id,
            username: username,
            displayName,
            email,
            photo: photos?.[0]?.value
        };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}
