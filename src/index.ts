import {ComponentSettings, Manager} from "@managed-components/types"
import {createCore} from "./core";
import {CreateTrackerCoreOptions} from "./types";
import {Tracker} from "./tracker";

export default async function (manager: Manager, settings: ComponentSettings) {
  const core = createCore({settings} as CreateTrackerCoreOptions);

  manager.addEventListener('pageview', async (event) => {
    const tracker = new Tracker(core, event);

    tracker.init();
    await tracker.track('pageview');
  });

  manager.addEventListener('ecommerce', async (event) => {
    const tracker = new Tracker(core, event);

    tracker.init();
    await tracker.track('ecommerce');
  });
}