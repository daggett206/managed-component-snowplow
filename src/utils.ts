import { MCEvent } from '@managed-components/types';
import * as crypto from 'crypto';

export const getDomainHash = (domain: string) => {
  return crypto
    .createHash('sha1')
    .update(domain)
    .digest('hex')
    .slice(0, 4);
}

export const getEventPayloadValue = (event: MCEvent, key: string) => {
  return (event.payload?.ecommerce || event.payload || {})?.[key] ?? null;
};

export const uuidv4 = () => {
  return crypto.randomUUID()
}