/** The four sections of the Maps window. This array is also the allow-list for
    `?view=`: a value that is not in here is not "unknown", it is a string a
    visitor typed, and it must resolve to "no panel" rather than to a panel
    with a bogus title. Same rule as `findCollection` in `config/collections.ts`.

    Adding a fifth section: one entry here, plus `onTheRoad.nav.<view>` in BOTH
    message files, plus an icon in `components/maps/icons.tsx`. */
export const ON_THE_ROAD_VIEWS = ['saved', 'routes', 'passes', 'info'] as const;

export type OnTheRoadView = (typeof ON_THE_ROAD_VIEWS)[number];

export function findView(value?: string): OnTheRoadView | undefined {
  return ON_THE_ROAD_VIEWS.find((view) => view === value);
}
