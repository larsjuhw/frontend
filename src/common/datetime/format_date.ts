import type { HassConfig } from "home-assistant-js-websocket";
import memoizeOne from "memoize-one";
import type { FrontendLocaleData } from "../../data/translation";
import { DateFormat } from "../../data/translation";
import { resolveTimeZone } from "./resolve-time-zone";

// Tuesday, August 10
export const formatDateWeekdayDay = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateWeekdayDayMem(locale, config.time_zone).format(dateObj);

const formatDateWeekdayDayMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) => {
    const formatter = new Intl.DateTimeFormat(locale.language, {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    });

    if (
      locale.date_format === DateFormat.language ||
      locale.date_format === DateFormat.system
    ) {
      return formatter;
    }

    return {
      format: (dateObj: Date) => {
        const parts = formatter.formatToParts(dateObj);
        const weekday = parts.find((part) => part.type === "weekday")?.value;
        const day = parts.find((part) => part.type === "day")?.value;
        const month = parts.find((part) => part.type === "month")?.value;
        const literals = parts
          .filter((part) => part.type === "literal")
          .map((part) => part.value);

        let result = `${weekday}`;

        if (literals.length > 0) {
          result += literals[0];
        }

        if (locale.date_format === DateFormat.DMY) {
          result += `${day} ${month}`;
        } else if (locale.date_format === DateFormat.MDY) {
          result += `${month} ${day}`;
        } else if (locale.date_format === DateFormat.YMD) {
          result += `${month} ${day}`;
        }

        return result;
      },
    };
  }
);

// August 10, 2021
export const formatDate = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateMem(locale, config.time_zone).format(dateObj);

const formatDateMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) => {
    const formatter = new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    });

    if (
      locale.date_format === DateFormat.language ||
      locale.date_format === DateFormat.system
    ) {
      return formatter;
    }

    return {
      format: (dateObj: Date) => {
        const parts = formatter.formatToParts(dateObj);
        const day = parts.find((part) => part.type === "day")?.value;
        const month = parts.find((part) => part.type === "month")?.value;
        const year = parts.find((part) => part.type === "year")?.value;
        const literals = parts
          .filter((part) => part.type === "literal")
          .map((part) => part.value);

        if (locale.date_format === DateFormat.DMY) {
          return `${day}${literals[0]}${month}${literals[1]}${year}`;
        }
        if (locale.date_format === DateFormat.MDY) {
          return `${month}${literals[0]}${day}${literals[1]}${year}`;
        }
        if (locale.date_format === DateFormat.YMD) {
          return `${year}${literals[0]}${month}${literals[1]}${day}`;
        }

        return formatter.format(dateObj);
      },
    };
  }
);

// Aug 10, 2021
export const formatDateShort = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateShortMem(locale, config.time_zone).format(dateObj);

const formatDateShortMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) => {
    const formatter = new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    });

    if (
      locale.date_format === DateFormat.language ||
      locale.date_format === DateFormat.system
    ) {
      return formatter;
    }

    return {
      format: (dateObj: Date) => {
        const parts = formatter.formatToParts(dateObj);
        const day = parts.find((part) => part.type === "day")?.value;
        const month = parts.find((part) => part.type === "month")?.value;
        const year = parts.find((part) => part.type === "year")?.value;
        const literals = parts
          .filter((part) => part.type === "literal")
          .map((part) => part.value);

        if (locale.date_format === DateFormat.DMY) {
          return `${day}${literals[0]}${month}${literals[1]}${year}`;
        }
        if (locale.date_format === DateFormat.MDY) {
          return `${month}${literals[0]}${day}${literals[1]}${year}`;
        }
        if (locale.date_format === DateFormat.YMD) {
          return `${year}${literals[0]}${month}${literals[1]}${day}`;
        }

        return formatter.format(dateObj);
      },
    };
  }
);

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
) => formatDateVeryShortMem(locale, config.time_zone).format(dateObj);

const formatDateVeryShortMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) => {
    const formatter = new Intl.DateTimeFormat(locale.language, {
      day: "numeric",
      month: "short",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    });

    if (
      locale.date_format === DateFormat.language ||
      locale.date_format === DateFormat.system
    ) {
      return formatter;
    }

    return {
      format: (dateObj: Date) => {
        const parts = formatter.formatToParts(dateObj);
        const day = parts.find((part) => part.type === "day")?.value;
        const month = parts.find((part) => part.type === "month")?.value;
        const literals = parts
          .filter((part) => part.type === "literal")
          .map((part) => part.value);

        if (locale.date_format === DateFormat.DMY) {
          return `${day}${literals[0]}${month}`;
        }
        if (locale.date_format === DateFormat.MDY) {
          return `${month}${literals[0]}${day}`;
        }
        if (locale.date_format === DateFormat.YMD) {
          return `${month}${literals[0]}${day}`;
        }

        return formatter.format(dateObj);
      },
    };
  }
);

// August 2021
export const formatDateMonthYear = (
  dateObj: Date,
  locale: FrontendLocaleData,
  config: HassConfig
) => formatDateMonthYearMem(locale, config.time_zone).format(dateObj);

const formatDateMonthYearMem = memoizeOne(
  (locale: FrontendLocaleData, serverTimeZone: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "long",
      year: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTimeZone),
    })
);

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
