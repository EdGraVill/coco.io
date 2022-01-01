/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document, Model, Schema, SchemaType, SchemaTypeOptions } from 'mongoose';

export interface Timestamps {
  created: Date;
  updated: Date;
}

export type InterfaceToSchema<I> = {
  [K in keyof Required<Omit<I, 'timestamps'>>]: Required<Omit<I, 'timestamps'>>[K] extends Date
    ? SchemaTypeOptions<DateConstructor | number> | Schema | SchemaType
    : Required<Omit<I, 'timestamps'>>[K] extends (infer R)[]
    ? R extends Schema.Types.ObjectId | Document
      ? SchemaTypeOptions<any[]> | Schema | SchemaType
      : R extends Record<string, unknown>
      ? Array<InterfaceToSchema<R>>
      : SchemaTypeOptions<any[]> | Schema | SchemaType
    : Required<Omit<I, 'timestamps'>>[K] extends Schema.Types.ObjectId | Document
    ? SchemaTypeOptions<any> | Schema | SchemaType
    : Required<Omit<I, 'timestamps'>>[K] extends Record<string, unknown>
    ? InterfaceToSchema<Required<Omit<I, 'timestamps'>>[K]>
    : SchemaTypeOptions<any> | Schema | SchemaType;
};

export type SchemaLayerBase = {
  timestamps: Timestamps;
};

export type SchemaLayer<S extends Record<string, any>> = S & SchemaLayerBase;

export type ExtractMethods<S extends SchemaLayer<Record<string, unknown>>, D extends Document> = {
  // @ts-ignore
  [M in keyof Omit<Omit<D, keyof S>, keyof Document>]: (this: D, ...args: Parameters<D[M]>) => ReturnType<D[M]>;
};

export type ExtractStatics<D extends Document, M extends Model<D>> = {
  // @ts-ignore
  [S in keyof Omit<M, keyof Model<Document>>]: (this: M, ...args: Parameters<M[S]>) => ReturnType<M[S]>;
};
