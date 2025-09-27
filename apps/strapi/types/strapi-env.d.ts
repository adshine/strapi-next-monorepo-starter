declare module "@strapi/types" {
  export interface StrapiEnv {
    (key: string, defaultValue?: any): any
    int(key: string, defaultValue?: number): number
    float(key: string, defaultValue?: number): number
    bool(key: string, defaultValue?: boolean): boolean
    array<T = string>(key: string, defaultValue?: T[]): T[]
    json<T = any>(key: string, defaultValue?: T): T
    date(key: string, defaultValue?: Date): Date
  }
}

export {}
