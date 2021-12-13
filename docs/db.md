# Data Base

Database schema created with mongoose.

## Folder Structure

```
src/db
├── [Model]           // (@db/[Model]) Name of the model.
|   ├── index.ts      // Export control of the model. This file only has to export all from ./model.ts and SchemaType from ./schema.ts. Nothing else.
|   ├── ?methods.ts   // Methods of the model. A function that can transform a document itself.
|   ├── model.ts      // File to describe the model and consolidate everything.
|   ├── schema.ts     // File to describe the schema of the model.
|   └── ?statics.ts   // Statics methods of the model. A function that can transform the collection of the model.
├── interfaces.ts     // (@db/interfaces) Functions to interact with the database from outside the src/db folder.
├── types.ts          // (@db/types) Common types for db
└── util.ts           // Common functions for all db (!Never import outside src/db)
```

## \[Model\]

Every model should follow the following structure

### index.ts

This file is to make easier the import from outside `src/db` looking something like `@db/[Model]`. In order to avoid files calling as circular dependencies are important to just export all exported from `./model.ts` and the `[Model]SchemaType` from `./schema.ts` as a type.

### ?methods.ts

Methods of a model are those functions that can interact with the document allowing modify the data inside it and are accessible in the document like `await [document].doSomething()`. This file is optional, models can contain or not methods.

#### Implementation

- [ ] Declare the method type as part of `ModelDocument` interface of `model.ts`.
```typescript
// ./model.ts
export interface ModelDocument extends Document, ModelSchemaType {
  asyncMethodExample(): Promise<void>;
}
```
- [ ] Use the following template in the `./methods.ts` if is new, or add a new method to the object passed as argument to `methodsAdditor`, replace `Model` for the name of your model.
```typescript
// ./methods.ts
import { methodsAdditor } from '@db/util';
import type { ModelDocument } from './model';
import type { ModelSchemaType } from './schema';

export const addModelMethods = methodsAdditor<ModelSchemaType, ModelDocument>({
  // Your methods go here
  async asyncMethodExample(newValue) {
    this.myProperty = newValue;

    await this.save()
  },
});
```
- [ ] Add methods to schema before calling `modelGetter` all inside `./model.ts`.
```typescript
// ./model.ts
import { addModelMethods } from './methods';
import { ModelSchema } from './schema';

addModelMethods(ModelSchema);
```

### model.ts

This file consolidates all the files needed to create a model for a collection.

Has a structure with three sections (after all the imports):

1. Setup methods or/and statics
```typescript
addModelMethods(modelSchema);
addModelStatics(modelSchema);
```
2. Declare the type for a Document and for the Model Collection. And export them.
```typescript
export interface ModelDocument extends Document, ModelSchemaType {
  asyncMethodExample(): Promise<void>;
}

export interface ModelModel extends Model<ModelDocument> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByCustomProperty(customProperty: string, projection?: any, options?: QueryOptions): ReturnType<ModelModel['findOne']>;
}
```
3. Register the model and export the function to get the model.
```typescript
export const modelName = 'Model';

export const getModel = modelGetter<ModelDocument, ModelModel>(modelName, modelSchema);
```

So the model can be run inside all the server-side code.
```typescript
// api.ts
import { getModel } from '@db/Model';

export default async function api(req, res) {
  // ...
  const Model = getModel();

  const Document = await Model.findByCustomProperty('foo');

  if (Document) {
    await Document.asyncMethodExample();
  }
  // ...
}
```

#### `modelGetter()`

`<WIP>`

### schema.ts

This file declares the shape of the document. This includes fields, type of information, and validations.

All the Schemas should include timestamps, so the `SchemaType` should be on top of the `SchemaLayer` type:
```typescript
import type { SchemaLayer } from '@db/types';
import type { OtherModelSchemaType } from '@db/OtherModel';

export type ModelSchemaType = SchemaLayer<{
  stringField: string;
  numberField: number;
  nestedField: OtherModelSchemaType;
}>;
```

Then the schema definition (the one who will consume the `Schema` class from `mongoose`) but with an enforcement of type by separing the object.
```typescript
import { Schema } from 'mongoose';
import type { InterfaceToSchema } from '@db/types';
import type { OtherModelSchema } from '@db/OtherModel';

export const modelSchemaDefinition: InterfaceToSchema<ModelSchemaType> = {
  stringField: Schema.Types.String,
  numberField: Schema.Types.Number,
  nestedField: OtherModelSchema,
};
```

And instead of create a "`new Schema(...)`" use the util function called `createSchema`.
```typescript
import { createSchema } from '@db/util';

export const ModelSchema = createSchema(modelSchemaDefinition);

// ModelSchema will return the same as create a new Schema() so pre validations can be set as always
```

### ?statics.ts

Statics methods of a model are those functions that can interact with the collection allowing modify the documents inside it and are accessible in the model like `await getModel().doSomething()`. This file is optional, models can contain or not static methods.

#### Implementation

- [ ] Declare the method type as part of `ModelModel` interface of `model.ts`.
```typescript
// ./model.ts
export interface ModelModel extends Model<ModelDocument> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByCustomProperty(customProperty: string, projection?: any, options?: QueryOptions): ReturnType<ModelModel['findOne']>;
}
```
- [ ] Use the following template in the `./statics.ts` if is new, or add a new method to the object passed as argument to `staticsAdditor`, replace `Model` for the name of your model.
```typescript
// ./statics.ts
import { staticsAdditor } from '@db/util';
import type { ModelDocument, ModelModel } from './model';
import type { ModelSchemaType } from './schema';

export const addModelStatics = staticsAdditor<ModelDocument, ModelModel>({
  // Your static methods go here
  findByCustomProperty(customProperty, projection, options) {
    return this.findOne({ customProperty }, projection, options);
  };
});
```
- [ ] Add static methods to schema before calling `modelGetter` all inside `./model.ts`.
```typescript
// ./model.ts
import { addModelStatics } from './methods';
import { ModelSchema } from './schema';

addModelStatics(ModelSchema);
```

## interfaces.ts

> `import { ... } from '@db/interfaces';`

Here are placed all the functions than can be safety called outside `src/db` to interact at database label.

### `connectToDB()`

`<WIP>`

## types.ts

> `import type { ... } from '@db/types';`

Here are all the common types that can be use inside and outside `src/db`.

## util.ts

> Never call outside `src/db`

Here are all the common functions that only should be imported inside `src/db`.
