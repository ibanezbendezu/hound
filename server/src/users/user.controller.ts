import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { User } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";


@Controller("users")
export class UserController {

    constructor(private readonly userService: UsersService) {
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    async getUserById(@Param("id") id: string) {
        const Userfound = await this.userService.getUserById(Number(id));
        if (!Userfound) throw new NotFoundException("User not found");
        return Userfound;
    }

    @Get("profile/:name")
    async getUserProfileAndRepos(@Param("name") name: string, @Res({ passthrough: true }) res: Response) {
        const username = name;
        const user_token = await this.userService.getUserToken("ibanezbendezu");

        try {
            const userRes = await fetch(`https://api.github.com/users/${username}`, {
                headers: {
                    authorization: `token ${user_token}`
                }
            });

            const userProfile = await userRes.json();

            const repoRes = await fetch(userProfile.repos_url, {
                headers: {
                    authorization: `token ${user_token}`
                }
            });
            const repos = await repoRes.json();

            return res.status(200).json({ userProfile, repos });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

}