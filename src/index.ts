import {ComponentSettings, Manager} from "@managed-components/types"
import {createCore} from "./core";
import {CreateTrackerCoreOptions} from "./types";
import {Tracker} from "./tracker";

export default async function (manager: Manager, settings: ComponentSettings) {
  const core = createCore({settings, manager} as CreateTrackerCoreOptions);

  manager.addEventListener(
    'pageview', 
    async (event) => new Tracker(core, event)
      .init()
      .track('pageview'),
  );

  manager.addEventListener(
    'ecommerce', 
    async (event) => new Tracker(core, event)
      .init()
      .track('ecommerce'),
  );

  manager.addEventListener(
    'event', 
    async (event) => new Tracker(core, event)
      .init()
      .track('event'),
  );
}