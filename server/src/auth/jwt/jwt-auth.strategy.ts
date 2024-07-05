import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { AppConfig } from "../../config/interfaces";
import { JwtPayload } from "../../shared";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService<AppConfig>) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (request: Request) => request?.cookies?.jwt
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("auth.jwt.secret")
        });
    }

    async validate(payload: JwtPayload) {
        console.log(
            `${JwtAuthStrategy.name}#${this.validate.name}(): payload = ${JSON.stringify(
                payload,
                null,
                4
            )}`
        );

        const { username, email, displayName, photo, iat, exp } = payload;
        return { username, email, displayName, photo, iat, exp };
    }
}