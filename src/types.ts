import {ComponentSettings} from "@managed-components/types";

export enum Id {
  UserId,
  CreateTs,
  VisitCount,
  NowTs,
  LastVisitTs,
  SessionId,
  PreviousSessionId,
  FirstEventId,
  FirstEventTs,
  EventIndex,
}

export interface TrackerSettings extends ComponentSettings {
  appId: string;
  namespace: string;
  endpoint: string;
  platform: string;
}

export interface CreateTrackerCoreOptions {
  settings: TrackerSettings;
}

export type EventType =
  | 'pageview'
  | 'ecommerce'
  | string
  ;