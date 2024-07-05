import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-github";

import { AppConfig } from "../../config/interfaces";
import { UsersService } from "../../users/users.service";

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, "github") {
    constructor(
        private configService: ConfigService<AppConfig>,
        private usersService: UsersService
    ) {
        super({
            clientID: configService.get<string>("auth.github.clientId"),
            clientSecret: configService.get<string>("auth.github.clientSecret"),
            callbackURL: configService.get<string>("auth.github.callbackURL"),
            scope: ["public_profile"]
        });
    }

    async validate(accessToken: string, _refreshToken: string, profile: Profile) {
        console.log(accessToken);
        const user = await this.usersService.findOrCreate(profile, accessToken, "github");
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
