import {MCEvent} from "@managed-components/types";
import {createCore} from "./core";
import {createCookieManager} from "./cookie";
import {createPageManager} from "./page";
import {
  createIdManager,
  incrementEventIndex,
  incrementVisitCount,
  updateEventIndex,
  updateFirstEventId,
  updateFirstEventTs,
  updateLastVisitTs,
  updateNowTs,
  updatePreviousSessionId,
  updateSessionId,
} from "./id";
import {createPayloadBuilder} from "./payload-builder";
import {EventType, Id} from "./types";

export class Tracker {
  public id: ReturnType<typeof createIdManager>;
  public page: ReturnType<typeof createPageManager>;
  public cookie: ReturnType<typeof createCookieManager>;
  public payload: ReturnType<typeof createPayloadBuilder>;

  constructor(
    private core: ReturnType<typeof createCore>,
    private event: MCEvent,
  ) {
    this.id = core.createIdManager(event);
    this.page = core.createPageManager(event);
    this.cookie = core.createCookieManager(event);
    this.payload = core.createPayloadBuilder(event);
  }

  public init() {
    this.page.initVariables();

    const id = this.cookie.get('id');
    const ses = this.cookie.get('ses');

    this.id.update(
      () => this.id.parse(id),
      updateNowTs,
    );
    this.updateCookies();

    const isFirstSession = !id && !ses;
    if (isFirstSession) {
      this.id.update(
        incrementVisitCount,
        updateNowTs,
      );
      this.updateCookies();
      return;
    }

    const isSessionExpired = !ses;
    if (isSessionExpired) {
      this.id.update(
        incrementVisitCount,
        updateLastVisitTs,
        updatePreviousSessionId,
        updateSessionId,
        updateNowTs,
        updateFirstEventId(),
        updateFirstEventTs(),
        updateEventIndex,
      );
      this.updateCookies();
      return;
    }
  }

  public track(type: EventType) {
    const payload = this.payload.build({
      type,
      duid: this.id.get(Id.UserId),
      vid: this.id.get(Id.VisitCount),
      sid: this.id.get(Id.SessionId),
      uid: this.page.get('email'),
      cx: this.payload.getCx(this.page.get('pvid')),
    });

    this.id.update(
      updateNowTs,
      updateFirstEventId(payload.eid),
      updateFirstEventTs(payload.dtm),
      incrementEventIndex,
    );

    this.updateCookies();

    const props = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: 'iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4',
        data: [payload]
      }),
    };

    console.log('Fetch props', JSON.stringify(props, null, 2));

    return fetch(
      `${this.core.getSettings().endpoint}/com.snowplowanalytics.snowplow/tp2`,
      props,
    )
      .catch((err) => {
        console.error(`Tracker.track() error:`, err);
      });
  }

  private updateCookies() {
    this.cookie.set('id', this.id.build(), {
      expiry: 1000 * 60 * 60 * 24 * 365, // 1 year
      scope: 'session',
    });
    this.cookie.set('ses', '*', {
      expiry: 1000 * 60 * 30, // 30 minutes
      scope: 'session',
    });
  }
}

