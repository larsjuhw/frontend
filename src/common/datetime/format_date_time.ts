import { DateTime } from "luxon";
import type { HassConfig } from "home-assistant-js-websocket";
import memoizeOne from "memoize-one";
import type { FrontendLocaleData } from "../../data/translation";
import { DateFormat } from "../../data/translation";
import { formatDateNumeric } from "./format_date";
import { formatTime } from "./format_time";
import { resolveTimeZone } from "./resolve-time-zone";
import { useAmPm } from "./use_am_pm";

// August 9, 2021, 8:23 AM
export const formatDateTime = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);
  const timeFormat = useAmPm(locale) ? "h:mm a" : "HH:mm";

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMMM")}, ${localeDt.toFormat("yyyy")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMMM")} ${localeDt.day}, ${localeDt.toFormat("yyyy")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("yyyy")}, ${localeDt.toFormat("MMMM")} ${localeDt.day}, ${localeDt.toFormat(timeFormat)}`;
    default:
      return localeDt.toLocaleString({
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: useAmPm(locale) ? "numeric" : "2-digit",
        minute: "2-digit",
        hourCycle: useAmPm(locale) ? "h12" : "h23",
      });
  }
};

export const formatDateTimeWithBrowserDefaults = (dateObj: Date) =>
  formatDateTimeWithBrowserDefaultsMem().format(dateObj);

const formatDateTimeWithBrowserDefaultsMem = memoizeOne(
  () =>
    new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
);

// Aug 9, 2021, 8:23 AM
export const formatShortDateTimeWithYear = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);
  const timeFormat = useAmPm(locale) ? "h:mm a" : "HH:mm";

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMM")}, ${localeDt.toFormat("yyyy")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMM")} ${localeDt.day}, ${localeDt.toFormat("yyyy")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("yyyy")}, ${localeDt.toFormat("MMM")} ${localeDt.day}, ${localeDt.toFormat(timeFormat)}`;
    default:
      return localeDt.toLocaleString({
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: useAmPm(locale) ? "numeric" : "2-digit",
        minute: "2-digit",
        hourCycle: useAmPm(locale) ? "h12" : "h23",
      });
  }
};

// Aug 9, 8:23 AM
export const formatShortDateTime = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);
  const timeFormat = useAmPm(locale) ? "h:mm a" : "HH:mm";

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMM")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.MDY:
    case DateFormat.YMD:
      return `${localeDt.toFormat("MMM")} ${localeDt.day}, ${localeDt.toFormat(timeFormat)}`;
    default:
      return localeDt.toLocaleString({
        month: "short",
        day: "numeric",
        hour: useAmPm(locale) ? "numeric" : "2-digit",
        minute: "2-digit",
        hourCycle: useAmPm(locale) ? "h12" : "h23",
      });
  }
};

export const formatShortDateTimeWithConditionalYear = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const now = new Date();
  if (now.getFullYear() === dateObj.getFullYear()) {
    return formatShortDateTime(dateObj, locale, config);
  }
  return formatShortDateTimeWithYear(dateObj, locale, config);
};

// August 9, 2021, 8:23:15 AM
export const formatDateTimeWithSeconds = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);
  const timeFormat = useAmPm(locale) ? "h:mm:ss a" : "HH:mm:ss";

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMMM")}, ${localeDt.toFormat("yyyy")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMMM")} ${localeDt.day}, ${localeDt.toFormat("yyyy")}, ${localeDt.toFormat(timeFormat)}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("yyyy")}, ${localeDt.toFormat("MMMM")} ${localeDt.day}, ${localeDt.toFormat(timeFormat)}`;
    default:
      return localeDt.toLocaleString({
        hour: useAmPm(locale) ? "numeric" : "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: useAmPm(locale) ? "h12" : "h23",
      });
  }
};

// 9/8/2021, 8:23 AM
export const formatDateTimeNumeric = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) =>
  `${formatDateNumeric(dateObj, locale, config)}, ${formatTime(
    dateObj,
    locale,
    config
  )}`;
