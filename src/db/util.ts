/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MongoServerError } from 'mongodb';
import type { Document, Error as Errors, Model, NativeError, SchemaDefinition, SchemaOptions } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { ExtractMethods, ExtractStatics, InterfaceToSchema, SchemaLayer } from './types';

export const createSchema = (
  schemaDefinition: InterfaceToSchema<SchemaLayer<Record<string, any>>>,
  options?: Omit<SchemaOptions, 'timestamps'>,
  errorMap?: Record<string, string | ((error: MongoServerError) => string)>,
) => {
  const schema = new Schema(schemaDefinition as SchemaDefinition, {
    timestamps: {
      createdAt: 'timestamps.created',
      updatedAt: 'timestamps.updated',
    },
    ...(options || {}),
  });

  schema.post<Document>(
    /^(save|update.*)$/g,
    // @ts-expect-error
    function postModify(err: MongoServerError, doc: Document, next: (err?: NativeError) => void) {
      console.log(err);

      if (err.name === 'ValidationError') {
        const castedError = err as unknown as Errors.ValidationError;

        const naturalLanguageString = Object.values(castedError.errors)
          .map((err) => err.message)
          .join('. ');

        next(new Error(naturalLanguageString));
      } else if (errorMap && errorMap[`${err.name}`]) {
        const errorMessage = errorMap[`${err.name}`];

        if (typeof errorMessage === 'string') {
          next(new Error(errorMessage));
        } else {
          next(new Error(errorMessage(err)));
        }
      } else if (errorMap) {
        for (const messageChunk in errorMap) {
          if (err.message.includes(messageChunk)) {
            const errorMessage = errorMap[messageChunk];

            if (typeof errorMessage === 'string') {
              next(new Error(errorMessage));
            } else {
              next(new Error(errorMessage(err)));
            }

            break;
          }
        }
      } else {
        next(err);
      }
    },
  );

  return schema;
};

export const modelGetter =
  <D extends Document, M extends Model<D>>(modelName: string, schema: Schema<D, M>) =>
  (): M => {
    if (!(globalThis as any).schemas) {
      (globalThis as any).schemas = {};
    }

    if (process.env.NODE_ENV !== 'production') {
      (globalThis as any).schemas[modelName] = schema;

      // This will help for development & testing process
      delete mongoose.models[modelName];

      Object.keys((globalThis as any).schemas).forEach((mn) => {
        mongoose.model(mn, (globalThis as any).schemas[mn]);
      });
    }

    try {
      const Model = mongoose.model(modelName) as M;

      return Model;
    } catch (error) {
      return mongoose.model<D, M>(modelName, schema) as M;
    }
  };

export function methodsAdditor<S extends SchemaLayer<Record<string, unknown>>, D extends Document>(
  methodsMap: ExtractMethods<S, D>,
) {
  return (schema: Schema) => {
    for (const methodName in methodsMap) {
      // @ts-expect-error
      schema.methods[methodName] = methodsMap[methodName];
    }
  };
}

export function staticsAdditor<D extends Document, M extends Model<D>>(methodsMap: ExtractStatics<D, M>) {
  return (schema: Schema) => {
    for (const methodName in methodsMap) {
      // @ts-expect-error
      schema.statics[methodName] = methodsMap[methodName];
    }
  };
}
