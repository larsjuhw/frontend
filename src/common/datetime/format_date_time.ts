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
  const formatter = formatDateTimeMem(locale, config.time_zone);

  if (
    locale.date_format === DateFormat.language ||
    locale.date_format === DateFormat.system
  ) {
    return formatter.format(dateObj);
  }

  // For custom date formats, combine date and time parts
  return `${formatDateNumeric(dateObj, locale, config)}, ${formatTime(
    dateObj,
    locale,
    config
  )}`;
};

const formatDateTimeMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: useAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: useAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

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
  if (
    locale.date_format === DateFormat.language ||
    locale.date_format === DateFormat.system
  ) {
    return formatShortDateTimeWithYearMem(locale, config.time_zone).format(
      dateObj
    );
  }

  // For custom date formats, combine date and time parts
  return `${formatDateNumeric(dateObj, locale, config)}, ${formatTime(
    dateObj,
    locale,
    config
  )}`;
};

const formatShortDateTimeWithYearMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: useAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: useAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

// Aug 9, 8:23 AM
export const formatShortDateTime = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const formatter = formatShortDateTimeMem(locale, config.time_zone);

  if (
    locale.date_format === DateFormat.language ||
    locale.date_format === DateFormat.system
  ) {
    return formatter.format(dateObj);
  }

  const dateParts = formatShortDateTimePartsMem(
    locale,
    config.time_zone
  ).formatToParts(dateObj);

  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;

  let dateStr: string;
  switch (locale.date_format) {
    case DateFormat.DMY:
      dateStr = `${day} ${month}`;
      break;
    case DateFormat.MDY:
    case DateFormat.YMD:
    default:
      dateStr = `${month} ${day}`;
      break;
  }

  return `${dateStr}, ${formatTime(dateObj, locale, config)}`;
};

const formatShortDateTimeMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "short",
      day: "numeric",
      hour: useAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: useAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

const formatShortDateTimePartsMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "short",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

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
  if (
    locale.date_format === DateFormat.language ||
    locale.date_format === DateFormat.system
  ) {
    return formatDateTimeWithSecondsMem(locale, config.time_zone).format(
      dateObj
    );
  }

  const timeParts = formatTimeWithSecondsMem(locale, config.time_zone).format(
    dateObj
  );

  return `${formatDateNumeric(dateObj, locale, config)}, ${timeParts}`;
};

const formatDateTimeWithSecondsMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: useAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: useAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

const formatTimeWithSecondsMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      hour: useAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: useAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

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
