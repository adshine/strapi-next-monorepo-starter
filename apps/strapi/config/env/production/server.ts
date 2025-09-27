import cronTasks from "../../cron-tasks"

type StrapiEnv = {
  (key: string, defaultValue?: any): any
  array<T = any>(key: string, defaultValue?: T[]): T[]
}

export default ({ env }: { env: StrapiEnv }) => ({
  proxy: true,
  url: env("APP_URL"),
  app: {
    keys: env.array("APP_KEYS"),
  },
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
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
})
