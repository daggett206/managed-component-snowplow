import {MCEvent} from "@managed-components/types";
import {TrackerSettings} from "./types";
import {v4} from "uuid";
import {getEventPayloadValue} from "./utils";

export type PageVariable =
  | 'pvid'
  | 'email'
;

export const createPageManager = (event: MCEvent, settings: TrackerSettings) => {
  const manager = {
    initVariables: () => {
      manager.set('pvid', v4());
      manager.set('email', getEventPayloadValue(event, 'customerEmail'));
    },
    set: (key: PageVariable, value: string) => {
      if (event.client.get(key)) {
        return;
      }
      event.client.set(key, value, {scope: 'page'});
    },
    get: (key: PageVariable): string => {
      return event.client.get(key);
    },
  };

  return manager;
};