import { z } from 'zod';
import * as entities from '#/libs/core/entities';

export const webRtcDescriptionSchema = z.object({
  sdp: z.string(),
  type: z.enum(['answer', 'offer', 'pranswer', 'rollback']),
});

export type WebRTCDescription = z.infer<typeof webRtcDescriptionSchema>;

export const readyEventTypeSchema = z.literal('ready');
export const newRecordEventTypeSchema = z.literal('new-record');
export const updateRecordEventTypeSchema = z.literal('update-record');

export const eventTypeSchema = z.union([readyEventTypeSchema, newRecordEventTypeSchema, updateRecordEventTypeSchema]);

export type EventTypeSchema = (typeof eventTypeSchema.options)[number];

export const createEventSchema = <E extends EventTypeSchema>(type: E) =>
  z.object({
    type,
  });

export const createMessageSchema = <E extends EventTypeSchema, P extends z.ZodTypeAny>(type: E, payload: P) =>
  createEventSchema(type).extend({
    payload,
  });

export const createEntityRecordSchema = <E extends z.ZodTypeAny, V extends z.ZodTypeAny>(entity: E, value: V) =>
  z.object({
    entity,
    value,
  });

export const userRecordSchema = createEntityRecordSchema(z.literal('user'), entities.userSchema);
export const fundRecordSchema = createEntityRecordSchema(z.literal('fund'), entities.fundSchema);
export const costRecordSchema = createEntityRecordSchema(z.literal('cost'), entities.costSchema);
export const costTagRecordSchema = createEntityRecordSchema(z.literal('cost-tag'), entities.costTagSchema);
export const incomeRecordSchema = createEntityRecordSchema(z.literal('income'), entities.incomeSchema);
export const incomeTagRecordSchema = createEntityRecordSchema(z.literal('income-tag'), entities.incomeTagSchema);
export const tagRecordSchema = createEntityRecordSchema(z.literal('tag'), entities.tagSchema);

export const allEntitiesRecordsSchema = z.union([
  userRecordSchema,
  fundRecordSchema,
  costRecordSchema,
  costTagRecordSchema,
  incomeRecordSchema,
  incomeTagRecordSchema,
  tagRecordSchema,
]);

export const readyMessageSchema = createEventSchema(readyEventTypeSchema);
export const newRecordMessageSchema = createMessageSchema(newRecordEventTypeSchema, allEntitiesRecordsSchema);
export const updateRecordMessageSchema = createMessageSchema(updateRecordEventTypeSchema, allEntitiesRecordsSchema);

export const webRtcMessageSchema = z.union([readyMessageSchema, newRecordMessageSchema, updateRecordMessageSchema]);

export type WebRTCMessage = z.infer<typeof webRtcMessageSchema>;
