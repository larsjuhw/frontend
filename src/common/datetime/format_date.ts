import type { HassConfig } from "home-assistant-js-websocket";
import { DateTime } from "luxon";
import memoizeOne from "memoize-one";
import type { FrontendLocaleData } from "../../data/translation";
import { DateFormat } from "../../data/translation";
import { resolveTimeZone } from "./resolve-time-zone";

// Tuesday, August 10
export const formatDateWeekdayDay = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);
  return localeDt.toFormat("EEEE, MMMM d");
};

// August 10, 2021
export const formatDate = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMMM")}, ${localeDt.toFormat("yyyy")}`;
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMMM")} ${localeDt.day}, ${localeDt.toFormat("yyyy")}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("yyyy")}, ${localeDt.toFormat("MMMM")} ${localeDt.day}`;
    default:
      return localeDt.toLocaleString({
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }
};

// Aug 10, 2021
export const formatDateShort = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMM")}, ${localeDt.toFormat("yyyy")}`;
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMM")} ${localeDt.day}, ${localeDt.toFormat("yyyy")}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("yyyy")}, ${localeDt.toFormat("MMM")} ${localeDt.day}`;
    default:
      return localeDt.toLocaleString({
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
};

// 10/08/2021
export const formatDateNumeric = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const formatter = formatDateNumericMem(locale, config.time_zone);

  if (
    locale.date_format === DateFormat.language ||
    locale.date_format === DateFormat.system
  ) {
    return formatter.format(dateObj);
  }

  const parts = formatter.formatToParts(dateObj);

  const literal = parts.find((value) => value.type === "literal")?.value;
  const day = parts.find((value) => value.type === "day")?.value;
  const month = parts.find((value) => value.type === "month")?.value;
  const year = parts.find((value) => value.type === "year")?.value;

  const lastPart = parts.at(parts.length - 1);
  let lastLiteral = lastPart?.type === "literal" ? lastPart?.value : "";

  if (locale.language === "bg" && locale.date_format === DateFormat.YMD) {
    lastLiteral = "";
  }

  const formats = {
    [DateFormat.DMY]: `${day}${literal}${month}${literal}${year}${lastLiteral}`,
    [DateFormat.MDY]: `${month}${literal}${day}${literal}${year}${lastLiteral}`,
    [DateFormat.YMD]: `${year}${literal}${month}${literal}${day}${lastLiteral}`,
  };

  return formats[locale.date_format];
};

const formatDateNumericMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) => {
    const localeString =
      locale.date_format === DateFormat.system ? undefined : locale.language;

    if (
      locale.date_format === DateFormat.language ||
      locale.date_format === DateFormat.system
    ) {
      return new Intl.DateTimeFormat(localeString, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
      });
    }

    return new Intl.DateTimeFormat(localeString, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    });
  }
);

// Aug 10
export const formatDateVeryShort = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);

  switch (locale.date_format) {
    case DateFormat.DMY:
      return `${localeDt.day} ${localeDt.toFormat("MMM")}`;
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMM")} ${localeDt.day}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("MMM")} ${localeDt.day}`;
    default:
      return localeDt.toLocaleString({
        day: "numeric",
        month: "short",
      });
  }
};

// August 2021
export const formatDateMonthYear = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => {
  const tzString = resolveTimeZone(locale.time_zone, config.time_zone);
  const dt = DateTime.fromJSDate(dateObj).setZone(tzString);

  const localeDt = dt.setLocale(locale.language);

  switch (locale.date_format) {
    case DateFormat.DMY:
    case DateFormat.MDY:
      return `${localeDt.toFormat("MMMM")} ${localeDt.toFormat("yyyy")}`;
    case DateFormat.YMD:
      return `${localeDt.toFormat("yyyy")} ${localeDt.toFormat("MMMM")}`;
    default:
      return localeDt.toLocaleString({
        month: "long",
        year: "numeric",
      });
  }
};

// August
export const formatDateMonth = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateMonthMem(locale, config.time_zone).format(dateObj);

const formatDateMonthMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "long",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

// 2021
export const formatDateYear = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateYearMem(locale, config.time_zone).format(dateObj);

const formatDateYearMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

// Monday
export const formatDateWeekday = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateWeekdayMem(locale, config.time_zone).format(dateObj);

const formatDateWeekdayMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      weekday: "long",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

// Mon
export const formatDateWeekdayShort = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateWeekdayShortMem(locale, config.time_zone).format(dateObj);

const formatDateWeekdayShortMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      weekday: "short",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);
