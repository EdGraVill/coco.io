/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from 'mongoose';

export const connectToDB = async (dbURI: string = process.env.DB_HOST || ''): Promise<void> => {
  const isAlreadyConnected = (globalThis as any).mongoConnection;

  if (isAlreadyConnected) {
    console.info('Connection restored');

    return;
  }

  try {
    const connection = await connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);

    (globalThis as any).mongoConnection = connection;

    console.info('Connected to DB');

    return;
  } catch (error) {
    console.error(error);
  }
};
