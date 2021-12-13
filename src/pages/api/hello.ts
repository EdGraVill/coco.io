import { connectToDB } from '@db/interfaces';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connectToDB('mongodb://localhost:27017/coco');

  res.status(200).json({ name: 'John Doe' });
}
