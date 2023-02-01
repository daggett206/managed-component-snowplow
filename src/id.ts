import {MCEvent} from "@managed-components/types";
import {Id, TrackerSettings} from "./types";
import {v4} from "uuid";

export const getDefaultIdStructure = () => {
  const now = new Date();
  const nowTs = Math.round(now.getTime() / 1000);
  const structure = [];

  structure[Id.UserId] = v4();
  structure[Id.CreateTs] = nowTs;
  structure[Id.VisitCount] = 0;
  structure[Id.NowTs] = nowTs;
  structure[Id.LastVisitTs] = '';
  structure[Id.SessionId] = v4();
  structure[Id.PreviousSessionId] = '';
  structure[Id.FirstEventId] = '';
  structure[Id.FirstEventTs] = '';
  structure[Id.EventIndex] = 0;

  return structure;
};

export const incrementVisitCount = (structure: (string | number)[]) => {
  structure[Id.VisitCount] = Number(structure[Id.VisitCount] || 0) + 1;
  return structure;
};

export const updateNowTs = (structure: (string | number)[]) => {
  structure[Id.NowTs] = Math.round(new Date().getTime() / 1000);
  return structure;
};

export const updateLastVisitTs = (structure: (string | number)[]) => {
  structure[Id.LastVisitTs] = structure[Id.NowTs];
  return structure;
};

export const updatePreviousSessionId = (structure: (string | number)[]) => {
  structure[Id.PreviousSessionId] = structure[Id.SessionId];
  return structure;
};

export const updateSessionId = (structure: (string | number)[]) => {
  structure[Id.SessionId] = v4();
  return structure;
};

export const updateFirstEventId = (value = '') => (structure: (string | number)[]) => {
  structure[Id.FirstEventId] = value;
  return structure;
};

export const updateFirstEventTs = (value = '') => (structure: (string | number)[]) => {
  structure[Id.FirstEventTs] = value;
  return structure;
};

export const updateEventIndex = (structure: (string | number)[], value = 0) => {
  structure[Id.EventIndex] = value;
  return structure;
};

export const incrementEventIndex = (structure: (string | number)[]) => {
  structure[Id.EventIndex] = Number(structure[Id.EventIndex] || 0) + 1;
  return structure;
};

export const createIdManager = (event: MCEvent, settings: TrackerSettings) => {
  const structure = [];
  const manager = {
    get structure() {
      return structure;
    },
    get: (index: Id) => {
      return structure[index];
    },
    set: (index: Id, value: string | number) => {
      structure[index] = value;
    },
    parse: (id: string) => {
      const existing = (id || '').split('.');
      return getDefaultIdStructure()
        .map((defaultValue, index) => existing[index] || defaultValue);
    },
    update: (...fns) => fns
      .reduce(
        (structure, fn) => fn(structure),
        structure.slice(),
      )
      .forEach((elem, index) => structure[index] = elem),
    build: () => manager.structure.join('.'),
  };

  return manager;
};