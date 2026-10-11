import NepaliFunctions from '@sajanm/nepali-functions'

export interface BsDate {
  year: number
  month: number
  day: number
}

export const adToBs = (year: number, month: number, day: number): BsDate | null => {
  try {
    return NepaliFunctions.AD2BS({ year, month, day }) as BsDate
  } catch {
    return null
  }
}

export const bsToAd = (bs: BsDate): BsDate | null => {
  try {
    return NepaliFunctions.BS2AD(bs) as BsDate
  } catch {
    return null
  }
}

export const getDaysInBsMonth = (year: number, month: number): number => {
  try {
    return NepaliFunctions.BS.GetDaysInMonth(year, month)
  } catch {
    return 30
  }
}