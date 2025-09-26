export default ({ env }: { env: (key: string, defaultValue?: any) => any }) => {
  // Email plugin disabled - sendgrid provider not installed
  const emailPlugin = null
  // To enable: install @strapi/provider-email-sendgrid
  // const emailPlugin = {
  //   config: {
  //     provider: 'sendgrid',
  //     providerOptions: {
  //       apiKey: env('SENDGRID_API_KEY'),
  //     },
  //     settings: {
  //       defaultFrom: env('SENDGRID_DEFAULT_FROM'),
  //       defaultReplyTo: env('SENDGRID_DEFAULT_REPLY_TO'),
  //     },
  //   },
  // }

  const awsS3Plugin = prepareAwsS3Config(env)

  const sentryPlugin = env("SENTRY_DSN")
    ? {
        enabled: true,
        config: {
          dsn: env("SENTRY_DSN"),
          sendMetadata: true,
        },
      }
    : {
        enabled: false,
        config: {},
      }

  const plugins: any = {}

  if (awsS3Plugin) {
    plugins.upload = awsS3Plugin
  }

  if (emailPlugin) {
    plugins.email = emailPlugin
  }

  plugins.sentry = sentryPlugin

  return plugins
}

const prepareAwsS3Config = (env: (key: string, defaultValue?: any) => any) => {
  const awsAccessKeyId = env("AWS_ACCESS_KEY_ID")
  const awsAccessSecret = env("AWS_ACCESS_SECRET")
  const awsRegion = env("AWS_REGION")
  const awsBucket = env("AWS_BUCKET")

  const awsConfigPresent =
    awsAccessKeyId && awsAccessSecret && awsRegion && awsBucket

  if (!awsConfigPresent) {
    console.warn(
      "AWS S3 upload configuration is not complete. Local file storage will be used."
    )
    return null
  }

  return {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsAccessSecret,
          },
          region: awsRegion,
          params: {
            Bucket: awsBucket,
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  }
}
