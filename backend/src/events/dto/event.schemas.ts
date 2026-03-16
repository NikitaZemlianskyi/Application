import * as yup from 'yup';
import { EventVisibility } from '../event.entity';

export const createEventSchema = yup.object({
  title: yup.string().required('Title is required'), 
  description: yup.string().required('Description is required'),
  dateTime: yup.date()
    .min(new Date(), 'Cannot create events in the past') 
    .required('Date and Time are required'), 
  location: yup.string().required('Location is required'), 
  capacity: yup.number().nullable().transform((value, originalValue) => {
    return String(originalValue).trim() === '' ? null : value;  
  }),
  visibility: yup.mixed<EventVisibility>().oneOf(Object.values(EventVisibility)).default(EventVisibility.PUBLIC),
  tags: yup.array().of(yup.string().required('Tag cannot be empty')).max(5, 'Maximum 5 tags allowed').optional(),
});

export const updateEventSchema = createEventSchema.partial(); 
export type CreateEventDto = yup.InferType<typeof createEventSchema>;
export type UpdateEventDto = yup.InferType<typeof updateEventSchema>;