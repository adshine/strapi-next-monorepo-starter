import type { Schema, Struct } from "@strapi/strapi"

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: "strapi_api_tokens"
  info: {
    description: ""
    displayName: "Api Token"
    name: "Api Token"
    pluralName: "api-tokens"
    singularName: "api-token"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }> &
      Schema.Attribute.DefaultTo<"">
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    expiresAt: Schema.Attribute.DateTime
    lastUsedAt: Schema.Attribute.DateTime
    lifespan: Schema.Attribute.BigInteger
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<"oneToMany", "admin::api-token"> &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    permissions: Schema.Attribute.Relation<
      "oneToMany",
      "admin::api-token-permission"
    >
    publishedAt: Schema.Attribute.DateTime
    type: Schema.Attribute.Enumeration<["read-only", "full-access", "custom"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"read-only">
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: "strapi_api_token_permissions"
  info: {
    description: ""
    displayName: "API Token Permission"
    name: "API Token Permission"
    pluralName: "api-token-permissions"
    singularName: "api-token-permission"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "admin::api-token-permission"
    > &
      Schema.Attribute.Private
    publishedAt: Schema.Attribute.DateTime
    token: Schema.Attribute.Relation<"manyToOne", "admin::api-token">
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: "admin_permissions"
  info: {
    description: ""
    displayName: "Permission"
    name: "Permission"
    pluralName: "permissions"
    singularName: "permission"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<"oneToMany", "admin::permission"> &
      Schema.Attribute.Private
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>
    publishedAt: Schema.Attribute.DateTime
    role: Schema.Attribute.Relation<"manyToOne", "admin::role">
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: "admin_roles"
  info: {
    description: ""
    displayName: "Role"
    name: "Role"
    pluralName: "roles"
    singularName: "role"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    description: Schema.Attribute.String
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<"oneToMany", "admin::role"> &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    permissions: Schema.Attribute.Relation<"oneToMany", "admin::permission">
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    users: Schema.Attribute.Relation<"manyToMany", "admin::user">
  }
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: "strapi_transfer_tokens"
  info: {
    description: ""
    displayName: "Transfer Token"
    name: "Transfer Token"
    pluralName: "transfer-tokens"
    singularName: "transfer-token"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }> &
      Schema.Attribute.DefaultTo<"">
    expiresAt: Schema.Attribute.DateTime
    lastUsedAt: Schema.Attribute.DateTime
    lifespan: Schema.Attribute.BigInteger
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "admin::transfer-token"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    permissions: Schema.Attribute.Relation<
      "oneToMany",
      "admin::transfer-token-permission"
    >
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: "strapi_transfer_token_permissions"
  info: {
    description: ""
    displayName: "Transfer Token Permission"
    name: "Transfer Token Permission"
    pluralName: "transfer-token-permissions"
    singularName: "transfer-token-permission"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "admin::transfer-token-permission"
    > &
      Schema.Attribute.Private
    publishedAt: Schema.Attribute.DateTime
    token: Schema.Attribute.Relation<"manyToOne", "admin::transfer-token">
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: "admin_users"
  info: {
    description: ""
    displayName: "User"
    name: "User"
    pluralName: "users"
    singularName: "user"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<"oneToMany", "admin::user"> &
      Schema.Attribute.Private
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    preferedLanguage: Schema.Attribute.String
    publishedAt: Schema.Attribute.DateTime
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private
    roles: Schema.Attribute.Relation<"manyToMany", "admin::role"> &
      Schema.Attribute.Private
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    username: Schema.Attribute.String
  }
}

export interface ApiFooterFooter extends Struct.SingleTypeSchema {
  collectionName: "footers"
  info: {
    description: ""
    displayName: "Footer"
    pluralName: "footers"
    singularName: "footer"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    i18n: {
      localized: true
    }
  }
  attributes: {
    copyRight: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    links: Schema.Attribute.Component<"utilities.link", true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<"oneToMany", "api::footer.footer">
    logoImage: Schema.Attribute.Component<"utilities.image-with-link", false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    publishedAt: Schema.Attribute.DateTime
    sections: Schema.Attribute.Component<"elements.footer-item", true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiInternalJobInternalJob extends Struct.CollectionTypeSchema {
  collectionName: "internal_jobs"
  info: {
    displayName: "InternalJob"
    pluralName: "internal-jobs"
    singularName: "internal-job"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    error: Schema.Attribute.String
    jobType: Schema.Attribute.Enumeration<
      ["RECALCULATE_FULLPATH", "CREATE_REDIRECT"]
    > &
      Schema.Attribute.Required
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::internal-job.internal-job"
    > &
      Schema.Attribute.Private
    payload: Schema.Attribute.JSON & Schema.Attribute.Required
    publishedAt: Schema.Attribute.DateTime
    relatedDocumentId: Schema.Attribute.String
    state: Schema.Attribute.Enumeration<["pending", "completed", "failed"]> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"pending">
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiNavbarNavbar extends Struct.SingleTypeSchema {
  collectionName: "navbars"
  info: {
    description: ""
    displayName: "Navbar"
    pluralName: "navbars"
    singularName: "navbar"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    i18n: {
      localized: true
    }
  }
  attributes: {
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    links: Schema.Attribute.Component<"utilities.link", true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<"oneToMany", "api::navbar.navbar">
    logoImage: Schema.Attribute.Component<"utilities.image-with-link", false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiPagePage extends Struct.CollectionTypeSchema {
  collectionName: "pages"
  info: {
    description: ""
    displayName: "Page"
    pluralName: "pages"
    singularName: "page"
  }
  options: {
    draftAndPublish: true
  }
  pluginOptions: {
    i18n: {
      localized: true
    }
  }
  attributes: {
    breadcrumbTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    children: Schema.Attribute.Relation<"oneToMany", "api::page.page">
    content: Schema.Attribute.DynamicZone<
      [
        "sections.image-with-cta-button",
        "sections.horizontal-images",
        "sections.hero",
        "sections.heading-with-cta-button",
        "sections.faq",
        "sections.carousel",
        "sections.animated-logo-row",
        "forms.newsletter-form",
        "forms.contact-form",
        "utilities.ck-editor-content",
      ]
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    fullPath: Schema.Attribute.String &
      Schema.Attribute.Unique &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    locale: Schema.Attribute.String
    localizations: Schema.Attribute.Relation<"oneToMany", "api::page.page">
    parent: Schema.Attribute.Relation<"manyToOne", "api::page.page">
    publishedAt: Schema.Attribute.DateTime
    redirects: Schema.Attribute.Relation<"oneToMany", "api::redirect.redirect">
    seo: Schema.Attribute.Component<"seo-utilities.seo", false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    slug: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true
        }
      }>
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiPlanPlan extends Struct.CollectionTypeSchema {
  collectionName: "plans"
  info: {
    description: "Subscription plans with features and pricing"
    displayName: "Plan"
    pluralName: "plans"
    singularName: "plan"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    allowsBulkRemix: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    allowsCollections: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    allowsFavorites: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    annualPrice: Schema.Attribute.Decimal & Schema.Attribute.Required
    billingCycle: Schema.Attribute.Enumeration<
      ["day", "month", "year", "lifetime"]
    > &
      Schema.Attribute.DefaultTo<"month">
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    dailyRemixLimit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>
    description: Schema.Attribute.Text
    features: Schema.Attribute.JSON
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    isLifetime: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<"oneToMany", "api::plan.plan"> &
      Schema.Attribute.Private
    monthlyPrice: Schema.Attribute.Decimal & Schema.Attribute.Required
    monthlyRemixLimit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    perksRichText: Schema.Attribute.RichText
    popularBadge: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    priority: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    promoBadge: Schema.Attribute.String
    publishedAt: Schema.Attribute.DateTime
    recommended: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    savings: Schema.Attribute.Decimal
    slug: Schema.Attribute.UID<"name">
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    stripePriceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    stripePriceIdAnnual: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    supportSLA: Schema.Attribute.Integer
    templateRequestLimit: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>
    tier: Schema.Attribute.Enumeration<
      ["free", "starter", "professional", "enterprise"]
    > &
      Schema.Attribute.Required
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiProjectProject extends Struct.CollectionTypeSchema {
  collectionName: "projects"
  info: {
    description: "Framer template projects available for remixing"
    displayName: "Project"
    pluralName: "projects"
    singularName: "project"
  }
  options: {
    draftAndPublish: true
  }
  attributes: {
    compatibility: Schema.Attribute.JSON
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    description: Schema.Attribute.RichText
    favoritedBy: Schema.Attribute.Relation<
      "manyToMany",
      "api::user-profile.user-profile"
    >
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    featuredImage: Schema.Attribute.Media<"images">
    fileSize: Schema.Attribute.BigInteger
    gallery: Schema.Attribute.Media<"images" | "videos", true>
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::project.project"
    > &
      Schema.Attribute.Private
    publishedAt: Schema.Attribute.DateTime
    remixCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    remixUrl: Schema.Attribute.String & Schema.Attribute.Required
    requiredPlan: Schema.Attribute.Enumeration<
      ["free", "starter", "professional", "enterprise"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"free">
    slug: Schema.Attribute.UID<"title">
    sortOrder: Schema.Attribute.Integer
    summary: Schema.Attribute.Text
    tags: Schema.Attribute.JSON
    title: Schema.Attribute.String & Schema.Attribute.Required
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    version: Schema.Attribute.String
    videoPreviewUrl: Schema.Attribute.String
  }
}

export interface ApiRedirectRedirect extends Struct.CollectionTypeSchema {
  collectionName: "redirects"
  info: {
    displayName: "Redirect"
    pluralName: "redirects"
    singularName: "redirect"
  }
  options: {
    draftAndPublish: true
  }
  attributes: {
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    destination: Schema.Attribute.String & Schema.Attribute.Required
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::redirect.redirect"
    > &
      Schema.Attribute.Private
    page: Schema.Attribute.Relation<"manyToOne", "api::page.page">
    permanent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    publishedAt: Schema.Attribute.DateTime
    source: Schema.Attribute.String & Schema.Attribute.Required
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiSubscriberSubscriber extends Struct.CollectionTypeSchema {
  collectionName: "subscribers"
  info: {
    displayName: "Subscriber"
    pluralName: "subscribers"
    singularName: "subscriber"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    email: Schema.Attribute.Email
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::subscriber.subscriber"
    > &
      Schema.Attribute.Private
    message: Schema.Attribute.Text
    name: Schema.Attribute.String
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiSubscriptionEventSubscriptionEvent
  extends Struct.CollectionTypeSchema {
  collectionName: "subscription_events"
  info: {
    description: "Track all subscription lifecycle events from Stripe"
    displayName: "SubscriptionEvent"
    pluralName: "subscription-events"
    singularName: "subscription-event"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    errorMessage: Schema.Attribute.Text
    eventType: Schema.Attribute.String & Schema.Attribute.Required
    idempotencyKey: Schema.Attribute.String & Schema.Attribute.Unique
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::subscription-event.subscription-event"
    > &
      Schema.Attribute.Private
    metadata: Schema.Attribute.JSON
    payload: Schema.Attribute.JSON & Schema.Attribute.Required
    processedAt: Schema.Attribute.DateTime
    publishedAt: Schema.Attribute.DateTime
    receivedAt: Schema.Attribute.DateTime & Schema.Attribute.Required
    retryCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    signature: Schema.Attribute.String
    status: Schema.Attribute.Enumeration<
      ["pending", "processed", "failed", "ignored"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"pending">
    stripeCustomerId: Schema.Attribute.String & Schema.Attribute.Required
    stripeEventId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    stripeSubscriptionId: Schema.Attribute.String
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    user: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.user"
    >
    webhookId: Schema.Attribute.String
  }
}

export interface ApiTemplateAccessLogTemplateAccessLog
  extends Struct.CollectionTypeSchema {
  collectionName: "template_access_logs"
  info: {
    description: "Track all template remix attempts and completions"
    displayName: "TemplateAccessLog"
    pluralName: "template-access-logs"
    singularName: "template-access-log"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    accessDuration: Schema.Attribute.Integer
    accessId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    attemptNumber: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 3
          min: 1
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>
    completedAt: Schema.Attribute.DateTime
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    errorCode: Schema.Attribute.String
    errorReason: Schema.Attribute.Text
    expiresAt: Schema.Attribute.DateTime & Schema.Attribute.Required
    initiatedAt: Schema.Attribute.DateTime & Schema.Attribute.Required
    ipAddress: Schema.Attribute.String
    issuedAt: Schema.Attribute.DateTime
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::template-access-log.template-access-log"
    > &
      Schema.Attribute.Private
    metadata: Schema.Attribute.JSON
    project: Schema.Attribute.Relation<"manyToOne", "api::project.project">
    publishedAt: Schema.Attribute.DateTime
    quotaCharged: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    remixUrl: Schema.Attribute.Text
    remixUrlHash: Schema.Attribute.String
    retryOf: Schema.Attribute.Relation<
      "oneToOne",
      "api::template-access-log.template-access-log"
    >
    sourceIp: Schema.Attribute.String
    status: Schema.Attribute.Enumeration<
      ["pending", "success", "failed", "expired"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"pending">
    supportTicketId: Schema.Attribute.String
    templateSize: Schema.Attribute.BigInteger
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    user: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.user"
    >
    userAgent: Schema.Attribute.Text
  }
}

export interface ApiTemplateRequestTemplateRequest
  extends Struct.CollectionTypeSchema {
  collectionName: "template_requests"
  info: {
    description: "User requests for new templates"
    displayName: "TemplateRequest"
    pluralName: "template-requests"
    singularName: "template-request"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    actualDelivery: Schema.Attribute.DateTime
    assignee: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.user"
    >
    attachments: Schema.Attribute.Media<"images" | "files" | "videos", true>
    category: Schema.Attribute.String
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    description: Schema.Attribute.Text & Schema.Attribute.Required
    estimatedDelivery: Schema.Attribute.DateTime
    isLate: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    lastUpdatedBy: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.user"
    >
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::template-request.template-request"
    > &
      Schema.Attribute.Private
    metadata: Schema.Attribute.JSON
    priority: Schema.Attribute.Enumeration<["standard", "priority", "rush"]> &
      Schema.Attribute.DefaultTo<"standard">
    project: Schema.Attribute.Relation<"manyToOne", "api::project.project">
    publishedAt: Schema.Attribute.DateTime
    referenceLinks: Schema.Attribute.JSON
    requester: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.user"
    >
    responseNotes: Schema.Attribute.Text
    slaHours: Schema.Attribute.Integer
    status: Schema.Attribute.Enumeration<
      ["new", "reviewing", "in_progress", "ready", "delivered"]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"new">
    submittedAt: Schema.Attribute.DateTime
    title: Schema.Attribute.String & Schema.Attribute.Required
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface ApiUserProfileUserProfile extends Struct.CollectionTypeSchema {
  collectionName: "user_profiles"
  info: {
    description: "Extended user profile with subscription and quota information"
    displayName: "UserProfile"
    pluralName: "user-profiles"
    singularName: "user-profile"
  }
  options: {
    draftAndPublish: false
  }
  attributes: {
    accountCreatedAt: Schema.Attribute.DateTime
    activeSessions: Schema.Attribute.JSON
    avatar: Schema.Attribute.Media<"images">
    bio: Schema.Attribute.Text
    collections: Schema.Attribute.JSON
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    dailyRemixesUsed: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    dailyResetAt: Schema.Attribute.DateTime
    displayName: Schema.Attribute.String
    emailNotifications: Schema.Attribute.JSON
    emailVerificationExpiry: Schema.Attribute.DateTime
    emailVerificationToken: Schema.Attribute.String
    emailVerified: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    favorites: Schema.Attribute.Relation<"manyToMany", "api::project.project">
    gracePeriodUntil: Schema.Attribute.DateTime
    language: Schema.Attribute.String & Schema.Attribute.DefaultTo<"en">
    lastActiveAt: Schema.Attribute.DateTime
    lastLoginAt: Schema.Attribute.DateTime
    lastPasswordChange: Schema.Attribute.DateTime
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "api::user-profile.user-profile"
    > &
      Schema.Attribute.Private
    monthlyRemixesLimit: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>
    monthlyRemixesUsed: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    passwordResetExpiry: Schema.Attribute.DateTime
    passwordResetToken: Schema.Attribute.String
    plan: Schema.Attribute.Relation<"manyToOne", "api::plan.plan">
    planExpiresAt: Schema.Attribute.DateTime
    preferences: Schema.Attribute.JSON
    publishedAt: Schema.Attribute.DateTime
    quotaResetDate: Schema.Attribute.DateTime
    referralSource: Schema.Attribute.String
    remixLockVersion: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    stripeCustomerId: Schema.Attribute.String & Schema.Attribute.Unique
    subscriptionEndDate: Schema.Attribute.DateTime
    subscriptionStartDate: Schema.Attribute.DateTime
    subscriptionState: Schema.Attribute.Enumeration<
      ["active", "trial", "past_due", "grace", "suspended", "canceled"]
    > &
      Schema.Attribute.DefaultTo<"active">
    subscriptionStatus: Schema.Attribute.Enumeration<
      [
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "trialing",
        "unpaid",
        "paused",
      ]
    > &
      Schema.Attribute.DefaultTo<"active">
    templateRequestsUsed: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>
    theme: Schema.Attribute.Enumeration<["light", "dark", "system"]> &
      Schema.Attribute.DefaultTo<"system">
    timezone: Schema.Attribute.String & Schema.Attribute.DefaultTo<"UTC">
    totalRemixes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>
    twoFactorEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    user: Schema.Attribute.Relation<
      "oneToOne",
      "plugin::users-permissions.user"
    >
  }
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: "strapi_releases"
  info: {
    displayName: "Release"
    pluralName: "releases"
    singularName: "release"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    actions: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::content-releases.release-action"
    >
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::content-releases.release"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String & Schema.Attribute.Required
    publishedAt: Schema.Attribute.DateTime
    releasedAt: Schema.Attribute.DateTime
    scheduledAt: Schema.Attribute.DateTime
    status: Schema.Attribute.Enumeration<
      ["ready", "blocked", "failed", "done", "empty"]
    > &
      Schema.Attribute.Required
    timezone: Schema.Attribute.String
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: "strapi_release_actions"
  info: {
    displayName: "Release Action"
    pluralName: "release-actions"
    singularName: "release-action"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    entryDocumentId: Schema.Attribute.String
    isEntryValid: Schema.Attribute.Boolean
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::content-releases.release-action"
    > &
      Schema.Attribute.Private
    publishedAt: Schema.Attribute.DateTime
    release: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::content-releases.release"
    >
    type: Schema.Attribute.Enumeration<["publish", "unpublish"]> &
      Schema.Attribute.Required
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: "i18n_locale"
  info: {
    collectionName: "locales"
    description: ""
    displayName: "Locale"
    pluralName: "locales"
    singularName: "locale"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::i18n.locale"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50
          min: 1
        },
        number
      >
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: "strapi_workflows"
  info: {
    description: ""
    displayName: "Workflow"
    name: "Workflow"
    pluralName: "workflows"
    singularName: "workflow"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<"[]">
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::review-workflows.workflow"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    publishedAt: Schema.Attribute.DateTime
    stageRequiredToPublish: Schema.Attribute.Relation<
      "oneToOne",
      "plugin::review-workflows.workflow-stage"
    >
    stages: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::review-workflows.workflow-stage"
    >
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: "strapi_workflows_stages"
  info: {
    description: ""
    displayName: "Stages"
    name: "Workflow Stage"
    pluralName: "workflow-stages"
    singularName: "workflow-stage"
  }
  options: {
    draftAndPublish: false
    version: "1.1.0"
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<"#4945FF">
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::review-workflows.workflow-stage"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String
    permissions: Schema.Attribute.Relation<"manyToMany", "admin::permission">
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    workflow: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::review-workflows.workflow"
    >
  }
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: "files"
  info: {
    description: ""
    displayName: "File"
    pluralName: "files"
    singularName: "file"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    alternativeText: Schema.Attribute.String
    caption: Schema.Attribute.String
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    ext: Schema.Attribute.String
    folder: Schema.Attribute.Relation<"manyToOne", "plugin::upload.folder"> &
      Schema.Attribute.Private
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    formats: Schema.Attribute.JSON
    hash: Schema.Attribute.String & Schema.Attribute.Required
    height: Schema.Attribute.Integer
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::upload.file"
    > &
      Schema.Attribute.Private
    mime: Schema.Attribute.String & Schema.Attribute.Required
    name: Schema.Attribute.String & Schema.Attribute.Required
    previewUrl: Schema.Attribute.String
    provider: Schema.Attribute.String & Schema.Attribute.Required
    provider_metadata: Schema.Attribute.JSON
    publishedAt: Schema.Attribute.DateTime
    related: Schema.Attribute.Relation<"morphToMany">
    size: Schema.Attribute.Decimal & Schema.Attribute.Required
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    url: Schema.Attribute.String & Schema.Attribute.Required
    width: Schema.Attribute.Integer
  }
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: "upload_folders"
  info: {
    displayName: "Folder"
    pluralName: "folders"
    singularName: "folder"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    children: Schema.Attribute.Relation<"oneToMany", "plugin::upload.folder">
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    files: Schema.Attribute.Relation<"oneToMany", "plugin::upload.file">
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::upload.folder"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    parent: Schema.Attribute.Relation<"manyToOne", "plugin::upload.folder">
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1
      }>
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique
    publishedAt: Schema.Attribute.DateTime
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: "up_permissions"
  info: {
    description: ""
    displayName: "Permission"
    name: "permission"
    pluralName: "permissions"
    singularName: "permission"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::users-permissions.permission"
    > &
      Schema.Attribute.Private
    publishedAt: Schema.Attribute.DateTime
    role: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.role"
    >
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
  }
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: "up_roles"
  info: {
    description: ""
    displayName: "Role"
    name: "role"
    pluralName: "roles"
    singularName: "role"
  }
  options: {
    draftAndPublish: false
  }
  pluginOptions: {
    "content-manager": {
      visible: false
    }
    "content-type-builder": {
      visible: false
    }
  }
  attributes: {
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    description: Schema.Attribute.String
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::users-permissions.role"
    > &
      Schema.Attribute.Private
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3
      }>
    permissions: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::users-permissions.permission"
    >
    publishedAt: Schema.Attribute.DateTime
    type: Schema.Attribute.String & Schema.Attribute.Unique
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    users: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::users-permissions.user"
    >
  }
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: "up_users"
  info: {
    description: ""
    displayName: "User"
    name: "user"
    pluralName: "users"
    singularName: "user"
  }
  options: {
    draftAndPublish: false
    timestamps: true
  }
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
    createdAt: Schema.Attribute.DateTime
    createdBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    locale: Schema.Attribute.String & Schema.Attribute.Private
    localizations: Schema.Attribute.Relation<
      "oneToMany",
      "plugin::users-permissions.user"
    > &
      Schema.Attribute.Private
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6
      }>
    provider: Schema.Attribute.String
    publishedAt: Schema.Attribute.DateTime
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private
    role: Schema.Attribute.Relation<
      "manyToOne",
      "plugin::users-permissions.role"
    >
    updatedAt: Schema.Attribute.DateTime
    updatedBy: Schema.Attribute.Relation<"oneToOne", "admin::user"> &
      Schema.Attribute.Private
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3
      }>
  }
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ContentTypeSchemas {
      "admin::api-token": AdminApiToken
      "admin::api-token-permission": AdminApiTokenPermission
      "admin::permission": AdminPermission
      "admin::role": AdminRole
      "admin::transfer-token": AdminTransferToken
      "admin::transfer-token-permission": AdminTransferTokenPermission
      "admin::user": AdminUser
      "api::footer.footer": ApiFooterFooter
      "api::internal-job.internal-job": ApiInternalJobInternalJob
      "api::navbar.navbar": ApiNavbarNavbar
      "api::page.page": ApiPagePage
      "api::plan.plan": ApiPlanPlan
      "api::project.project": ApiProjectProject
      "api::redirect.redirect": ApiRedirectRedirect
      "api::subscriber.subscriber": ApiSubscriberSubscriber
      "api::subscription-event.subscription-event": ApiSubscriptionEventSubscriptionEvent
      "api::template-access-log.template-access-log": ApiTemplateAccessLogTemplateAccessLog
      "api::template-request.template-request": ApiTemplateRequestTemplateRequest
      "api::user-profile.user-profile": ApiUserProfileUserProfile
      "plugin::content-releases.release": PluginContentReleasesRelease
      "plugin::content-releases.release-action": PluginContentReleasesReleaseAction
      "plugin::i18n.locale": PluginI18NLocale
      "plugin::review-workflows.workflow": PluginReviewWorkflowsWorkflow
      "plugin::review-workflows.workflow-stage": PluginReviewWorkflowsWorkflowStage
      "plugin::upload.file": PluginUploadFile
      "plugin::upload.folder": PluginUploadFolder
      "plugin::users-permissions.permission": PluginUsersPermissionsPermission
      "plugin::users-permissions.role": PluginUsersPermissionsRole
      "plugin::users-permissions.user": PluginUsersPermissionsUser
    }
  }
}
