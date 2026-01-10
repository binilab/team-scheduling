export type Language = "ko" | "en"

const TIMEZONE_BY_LANGUAGE: Record<Language, string> = {
  ko: "Asia/Seoul",
  en: "America/New_York",
}

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  ko: "ko-KR",
  en: "en-US",
}

export function getTimeZoneForLanguage(language: Language) {
  return TIMEZONE_BY_LANGUAGE[language]
}

function getFormatter(
  language: Language,
  options: Intl.DateTimeFormatOptions,
  timeZone?: string,
) {
  return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
    timeZone: timeZone ?? TIMEZONE_BY_LANGUAGE[language],
    ...options,
  })
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value)
}

function getParts(
  value: Date | string,
  language: Language,
  options: Intl.DateTimeFormatOptions,
  timeZone?: string,
) {
  return getFormatter(language, options, timeZone).formatToParts(toDate(value))
}

function getPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? ""
}

export function formatDate(value: Date | string, language: Language, timeZone?: string) {
  return getFormatter(language, { dateStyle: "medium" }, timeZone).format(toDate(value))
}

export function formatDateTime(value: Date | string, language: Language, timeZone?: string) {
  return getFormatter(language, { dateStyle: "medium", timeStyle: "short" }, timeZone).format(toDate(value))
}

export function formatYearMonthDay(value: Date | string, language: Language, timeZone?: string) {
  const parts = getParts(value, language, { year: "numeric", month: "2-digit", day: "2-digit" }, timeZone)
  const year = getPart(parts, "year")
  const month = getPart(parts, "month")
  const day = getPart(parts, "day")
  return `${year}-${month}-${day}`
}

export function formatMonthDay(value: Date | string, language: Language, timeZone?: string) {
  const parts = getParts(value, language, { month: "numeric", day: "numeric" }, timeZone)
  const month = getPart(parts, "month")
  const day = getPart(parts, "day")
  return `${month}/${day}`
}

export function formatWeekday(value: Date | string, language: Language, timeZone?: string) {
  const parts = getParts(value, language, { weekday: "short" }, timeZone)
  return getPart(parts, "weekday")
}

export function formatMonthDayWeekday(value: Date | string, language: Language, timeZone?: string) {
  const parts = getParts(value, language, { month: "numeric", day: "numeric", weekday: "short" }, timeZone)
  const month = getPart(parts, "month")
  const day = getPart(parts, "day")
  const weekday = getPart(parts, "weekday")
  return `${month}/${day} (${weekday})`
}

export function formatMonthDayWeekdayTime(value: Date | string, language: Language, timeZone?: string) {
  const parts = getParts(value, language, {
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }, timeZone)
  const month = getPart(parts, "month")
  const day = getPart(parts, "day")
  const weekday = getPart(parts, "weekday")
  const hour = getPart(parts, "hour")
  const minute = getPart(parts, "minute")
  return `${month}/${day} (${weekday}) ${hour}:${minute}`
}

type DateParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

function pad2(value: number) {
  return String(value).padStart(2, "0")
}

function partsToUtcMs(parts: DateParts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

function getDatePartsInTimeZone(date: Date, timeZone: string): DateParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0")

  return {
    year: partValue("year"),
    month: partValue("month"),
    day: partValue("day"),
    hour: partValue("hour"),
    minute: partValue("minute"),
    second: partValue("second"),
  }
}

export function zonedTimeToUtc(parts: DateParts, timeZone: string) {
  const utcCandidate = new Date(partsToUtcMs(parts))
  const tzParts = getDatePartsInTimeZone(utcCandidate, timeZone)
  let diff = partsToUtcMs(parts) - partsToUtcMs(tzParts)
  let adjusted = new Date(utcCandidate.getTime() + diff)

  const tzPartsRound2 = getDatePartsInTimeZone(adjusted, timeZone)
  diff = partsToUtcMs(parts) - partsToUtcMs(tzPartsRound2)
  adjusted = new Date(adjusted.getTime() + diff)

  return adjusted
}

export function zonedDateAtStartOfDay(date: Date, timeZone: string) {
  return zonedTimeToUtc(
    {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: 0,
      minute: 0,
      second: 0,
    },
    timeZone,
  )
}

export function formatDateTimeInput(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  const year = partValue("year")
  const month = partValue("month")
  const day = partValue("day")
  const hour = partValue("hour")
  const minute = partValue("minute")

  return `${year}-${month}-${day}T${hour}:${minute}`
}

export function parseDateTimeInput(value: string): DateParts | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/)
  if (!match) return null
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: 0,
  }
}

export function addDaysToYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number)
  const utcMs = Date.UTC(year, month - 1, day + days, 0, 0, 0)
  const next = new Date(utcMs)
  return `${next.getUTCFullYear()}-${pad2(next.getUTCMonth() + 1)}-${pad2(next.getUTCDate())}`
}

export function zonedDateFromYmd(ymd: string, timeZone: string) {
  const [year, month, day] = ymd.split("-").map(Number)
  return zonedTimeToUtc({ year, month, day, hour: 0, minute: 0, second: 0 }, timeZone)
}

export function zonedDateFromYmdTime(ymd: string, time: string, timeZone: string) {
  const [year, month, day] = ymd.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  return zonedTimeToUtc({ year, month, day, hour, minute, second: 0 }, timeZone)
}
