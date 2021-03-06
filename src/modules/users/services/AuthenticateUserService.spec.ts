// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('CreateaUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'manolo',
      email: 'ts@ts.com',
      password: '123123',
    });

    const response = await authenticateUserService.execute({
      email: 'ts@ts.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able authenticate with non existing user', async () => {
    expect(
      authenticateUserService.execute({
        email: 'ts@ts.com',
        password: '123123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with password invalid', async () => {
    await fakeUsersRepository.create({
      name: 'manolo',
      email: 'ts@ts.com',
      password: '123123',
    });

    expect(
      authenticateUserService.execute({
        email: 'ts@ts.com',
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
