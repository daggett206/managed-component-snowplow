import {ClientSetOptions, MCEvent} from "@managed-components/types";
import {TrackerSettings} from "./types";
import {getDomainHash} from "./utils";

export const createCookieManager = (event: MCEvent, settings: TrackerSettings) => {
  const {namespace} = settings;
  const domainHash = getDomainHash(event.client.url.hostname + '/');

  return {
    set: (name, value, opts?: ClientSetOptions) => {
      event.client.set(`${namespace}_${name}.${domainHash}`, value, opts);
    },
    get: (name) => {
      return event.client.get(`${namespace}_${name}.${domainHash}`);
    },
  };
}