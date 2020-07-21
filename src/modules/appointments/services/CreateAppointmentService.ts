import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  date: Date;
  provider_id: string;
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository
  ) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public async execute({
    date,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    const appontmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appontmentDate
    );

    if (findAppointmentInSameDate) {
      throw new AppError('this appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appontmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
