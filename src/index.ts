import {ComponentSettings, Manager} from "@managed-components/types"
import {createCore} from "./core";
import {CreateTrackerCoreOptions} from "./types";
import {Tracker} from "./tracker";

export default async function (manager: Manager, settings: ComponentSettings) {
  const core = createCore({settings, manager} as CreateTrackerCoreOptions);

  const track = (event, name) => {
    return new Tracker(core, event)
      .init()
      .track(name)
  }

  manager.addEventListener(
    'pageview',
    async (event) => track(event, 'pageview'),
  );

  manager.addEventListener(
    'ecommerce',
    async (event) => track(event, 'ecommerce'),
  );

  // this listener doesn't see zaraz.track('Stylecreator Viewed') event
  manager.addEventListener(
    'event', 
    async (event) => track(event, 'event'),
  );
}