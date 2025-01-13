import { z } from 'zod';
import * as entities from '#/libs/core/entities';

export const webRtcDescriptionSchema = z.object({
  sdp: z.string(),
  type: z.enum(['answer', 'offer', 'pranswer', 'rollback']),
});

export type WebRTCDescription = z.infer<typeof webRtcDescriptionSchema>;

export const readyEventTypeSchema = z.literal('ready');
export const confirmEventTypeSchema = z.literal('confirm');
export const newRecordEventTypeSchema = z.literal('new-record');

export const eventTypeSchema = z.union([readyEventTypeSchema, confirmEventTypeSchema, newRecordEventTypeSchema]);

export type EventTypeSchema = (typeof eventTypeSchema.options)[number];

export const createEventSchema = <E extends EventTypeSchema>(type: E) =>
  z.object({
    channelId: z.string().optional(),
    type,
  });

export const createMessageSchema = <E extends EventTypeSchema, P extends z.ZodTypeAny>(type: E, payload: P) =>
  createEventSchema(type).extend({
    payload,
  });

export const createEntityRecordSchema = <E extends z.ZodTypeAny, V extends z.ZodTypeAny>(entity: E, value: V) =>
  z.object({
    synchronizationOrderId: entities.synchronizationOrderSchema.shape.id.optional(),
    entity,
    value,
  });

export const userRecordSchema = createEntityRecordSchema(
  z.literal('user'),
  entities.userSchema.extend({
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
);
export const fundRecordSchema = createEntityRecordSchema(
  z.literal('fund'),
  entities.fundSchema.extend({
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
);
export const walletRecordSchema = createEntityRecordSchema(
  z.literal('wallet'),
  entities.walletSchema.extend({
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
);
export const costRecordSchema = createEntityRecordSchema(
  z.literal('cost'),
  z.intersection(
    entities.costSchema,
    z.object({
      createdAt: z.number(),
      updatedAt: z.number(),
    }),
  ),
);
export const incomeRecordSchema = createEntityRecordSchema(
  z.literal('income'),
  z.intersection(
    entities.incomeSchema,
    z.object({
      createdAt: z.number(),
      updatedAt: z.number(),
    }),
  ),
);
export const tagRecordSchema = createEntityRecordSchema(
  z.literal('tag'),
  entities.tagSchema.extend({
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
);

export const allEntitiesRecordsSchema = z.union([
  userRecordSchema,
  walletRecordSchema,
  fundRecordSchema,
  costRecordSchema,
  incomeRecordSchema,
  tagRecordSchema,
]);

export const readyMessageSchema = createEventSchema(readyEventTypeSchema);
export const confirmMessageSchema = createMessageSchema(confirmEventTypeSchema, z.boolean());
export const newRecordMessageSchema = createMessageSchema(newRecordEventTypeSchema, allEntitiesRecordsSchema);

export const webRtcMessageSchema = z.union([readyMessageSchema, confirmMessageSchema, newRecordMessageSchema]);

export type ConfirmMessage = z.infer<typeof confirmMessageSchema>;

export type NewRecordMessage = z.infer<typeof newRecordMessageSchema>;

export type WebRTCMessage = z.infer<typeof webRtcMessageSchema>;
