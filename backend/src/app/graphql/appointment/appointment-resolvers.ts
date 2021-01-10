import { UserInputError } from 'apollo-server-express'
import Appointment from '../../models/Appointment';
import User from '../../models/User';

export default {
    Appointment: {
        provider: (appointment) => User.findById(appointment.provider)
    },
    Query: {
        appointments: (_, __, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');
            return Appointment.find();
        },
        appointment: (_, { id}, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');
            return Appointment.findById(id);
        },
    },
    Mutation: {
        createAppointment: async (_, { data }, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');
            const { provider, date } = data;
            const findAppointmentInSameDate = await Appointment.find({ provider, date });
            if(findAppointmentInSameDate.length>0) 
                throw new Error('This appointment is already booked.');

            return Appointment.create(data);
        },
        updateAppointment: (_, { id, data }, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');
            return Appointment.findOneAndUpdate(id, data, { new : true });
        },
        deleteAppointment: async (_, { id }, { user }) => {
            if(!user) throw new UserInputError('Você não está autenticado.');
            return !!(await Appointment.findByIdAndDelete(id));
        },
    },
}