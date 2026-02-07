import { APIRequestContext } from "@playwright/test";
import { getHeaders } from "../utils/helpers/apiHelpers";

const urlUser = "api/v1/user";

export async function inviteUser(
    requesterId: string, 
    request: APIRequestContext, 
    email: string
) {
    return await request.post(urlUser, {
        headers: getHeaders(requesterId),
        data: { email },
    });
}

export async function getUserContext(
    requesterId: string,
    request: APIRequestContext,
) {
    return await request.get(urlUser, {
        headers: getHeaders(requesterId),
    });
}

export async function getAllUsers(
    requesterId: string,
    request: APIRequestContext,
) {
    return await request.get("api/v1/admin/user", {
        headers: getHeaders(requesterId),
    });
}

export async function getAllUserInvitations(
    requesterId: string,
    request: APIRequestContext,
) {
    return await request.get("api/v1/admin/request", {
        headers: getHeaders(requesterId),
    });
}

export async function acceptUserInvitation(
    requesterId: string,
    request: APIRequestContext,
    invitedUserId: string,
    firstName: string,
    lastName: string
) {
    return await request.post(`api/v1/admin/request/${invitedUserId}`, {
        headers: getHeaders(requesterId),
        data: { 
            firstName,
            lastName,
        },
    });
}