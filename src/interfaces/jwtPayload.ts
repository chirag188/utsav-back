import { JwtPayload } from 'jsonwebtoken'
export interface JWTPayload extends JwtPayload {
	id: string
	email: string
	firstname: string
	lastname: string
	userType: string
}
