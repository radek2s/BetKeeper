export const getIdentifierRequest = (email: string) => ({
  identifierValue: email,
  identifierType: "email",
  status: "verified",
});

export const getUserRequest = (fullName: string) => ({
  fullName,
  status: "active",
});

export const getRequestInt = (token: string, body: object) => ({
  method: "POST",
  headers: {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
