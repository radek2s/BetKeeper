import { APIRequestContext } from "@playwright/test";
import { UserRequestType } from "@domain/user/entities";
import { getHeaders, handleResponse } from "../utils/helpers/apiHelpers";

export async function inviteUser(
    requesterId: string, 
    request: APIRequestContext, 
    email: string
) {
    const response = await request.post("api/v1/user", {
        data: { email },
        headers: getHeaders(requesterId),
    });

    return handleResponse<UserRequestType>(response);
}