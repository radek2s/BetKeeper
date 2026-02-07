import { APIRequestContext } from "@playwright/test";
import { getHeaders } from "../utils/helpers/apiHelpers";

export async function inviteUser(
    requesterId: string, 
    request: APIRequestContext, 
    email: string
) {
    return await request.post("api/v1/user", {
        data: { email },
        headers: getHeaders(requesterId),
    });
}