/** Claims stored in the access token returned by POST /api/auth/google */
export interface JwtPayload {
  sub: string;
  email: string;
  employeeId: number | null;
}
