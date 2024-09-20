import { Decimal } from '@prisma/client/runtime/library';

export class Product {
  id: number;
  name: string;
  price: Decimal;
  image: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  idUserCreated: number;
  idUserEdited?: number;
}
