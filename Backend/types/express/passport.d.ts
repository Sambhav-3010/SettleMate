import "express";

declare module "express" {
    interface User {
        id: string;
        email?: string;
        username?: string;
        name?: string;
        upiId?: string;
    }

    interface Request {
        user?: User;
        isAuthenticated(): this is Request & { user: User };
    }
}
