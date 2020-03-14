export declare type TEmail = string
export declare type TDay = string
export declare type THref = string
export declare type TMonth = string
export declare type TPassword = string
export declare type TUrlCollectionId = string
export declare type TUrlCollectionName = string
export declare type TUrlId = string
export declare type TUrlTitle = string

export interface IUrlCollectionItemId {
  urlCollectionId: TUrlCollectionId
  urlId: TUrlId
}

export interface IUrlDailyHits {
  id: TUrlId
  day: TDay
  num: number
}

export interface IUrlMonthlyHits {
  id: TUrlId
  month: TMonth
  num: number
}

export interface IUrlMetadata {
  statusCode?: number
  title?: TUrlTitle // url read only title, scraped if possible
}

export interface IUrl {
  href: THref
  metadata: IUrlMetadata
  title: TUrlTitle // url title, optionally overridden by user
}

export interface IUrlItem extends IUrl {
  id: TUrlId
}

export interface IUrlCollection {
  id: TUrlCollectionId
  name: TUrlCollectionName
  urls: IUrlItem[]
}

export interface IUrlCollectionItem extends IUrlCollectionItemId, IUrl {}
