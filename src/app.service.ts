import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
	constructor(
		private authService: AuthService,
		private usersService: UsersService
	) {}
}
