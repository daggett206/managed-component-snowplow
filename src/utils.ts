import { MCEvent } from '@managed-components/types';
import hash from 'sha1';
import {v4} from 'uuid';
import {Id} from "./types";

export const getDomainHash = (domain: string) => {
  return hash(domain).slice(0, 4);
}

export const getEventPayloadValue = (event: MCEvent, key: string) => {
  return (event.payload?.ecommerce || event.payload || {})?.[key] ?? null;
};