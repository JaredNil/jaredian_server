import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';

import * as fs from 'fs';
import * as path from 'path';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from './../track/track.service';

@Injectable({})
export class UsersService {
	constructor(
		@InjectModel(User) private userRepository: typeof User,
		private trackService: TrackService,
		private albumService: AlbumService
	) {}

	async createUser(username, hash, salt) {
		const newUser = await this.userRepository.create({ username, hash, salt });
		return newUser;
	}

	async pushInitTracks(albumId: number, albumFolder: string) {
		// const folderPathMain = path.resolve('C:\\MAIN__FILES\\FOR_WEB\\spotic_server\\src\\InitTracks\\');
		console.log('HERE HERE');

		console.log(process.cwd());
		console.log(process.cwd());
		console.log(process.cwd());

		console.log('HERE HERE');

		const folderPathMain = path.resolve(process.env.PATH_DEFAULT, 'src\\InitTracks\\');

		let fileList = fs.readdirSync(path.resolve(folderPathMain, albumFolder));

		fileList = fileList.map((file) => path.resolve(folderPathMain, albumFolder, file));

		let result = '';

		fileList.forEach((filePath) => {
			fs.readFile(filePath, async (_, data) => {
				const fileInstance = {
					audio: [
						{
							buffer: data,
							size: data.byteLength,
						},
					],
				};

				const track = await this.trackService.create(fileInstance.audio[0], albumId);
				await this.albumService.pushTrack(albumId, track);
			});
		});
	}

	async getUserByName(username: string) {
		const users = await this.userRepository.findOne({ include: { all: true }, where: { username } });
		return users;
	}

	async getAllUsers() {
		const users = await this.userRepository.findAll({ include: { all: true } });
		return users;
	}

	async getUserByUsername(username: string) {
		const user = await this.userRepository.findOne({ where: { username }, include: { all: true } });

		return user;
	}
}
