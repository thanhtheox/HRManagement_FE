import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { Department, Position } from "src/types/userType";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: User & DefaultSession;
    }

    interface User extends DefaultUser {
        _id: string;
        roles: string[];
        phoneNumber: string;
        birthday: string;
        level: string;
        address: string;
        gender: string;
        homeTown: string;
        ethnicGroup: string;
        avatarImage: string;
        code: string;
        positionId: Position;
        departmentId: Department;
        name: string;
        refreshToken?: string;
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        roles: string[];
    }
}
