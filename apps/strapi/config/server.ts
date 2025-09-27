import cronTasks from "./cron-tasks"

type StrapiEnv = {
  (key: string, defaultValue?: any): any
  int(key: string, defaultValue?: number): number
  bool(key: string, defaultValue?: boolean): boolean
  array<T = any>(key: string, defaultValue?: T[]): T[]
}

export default ({ env }: { env: StrapiEnv }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("STRAPI_URL"),
  admin: {
    forgotPassword: {
      emailTemplate: {
        from: env("EMAIL_FROM"),
        replyTo: env("EMAIL_REPLY_TO"),
        subject: "Reset your password",
        text: "Password reset request",
        html: "Password reset request",
      },
    },
  },
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
})
