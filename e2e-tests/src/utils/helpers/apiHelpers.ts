import { APIRequestContext, APIResponse } from "@playwright/test";
import { InviteUserResponse } from "../types"
import { ApiError } from "../customErrors";

export async function inviteUser(requesterId: string, request: APIRequestContext, email: string): Promise<InviteUserResponse> {
    const response = await request.post("api/v1/user", {
        data: { email },
        headers: {
            "Content-Type": "application/json",
            "x-active-userid": requesterId
        }
    });

    if (!response.ok()) {
        const errorBody = await response.json();
        throw new ApiError(response.status(), errorBody);
    }


    return await response.json() as InviteUserResponse;
}