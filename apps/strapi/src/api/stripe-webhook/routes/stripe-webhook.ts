export default {
  routes: [
    {
      method: "POST",
      path: "/stripe/webhook",
      handler: "stripe-webhook.handleWebhook",
      config: {
        auth: false,
        policies: [],
        middlewares: [
          // Raw body is needed for Stripe webhook signature verification
          {
            name: "global::raw-body",
            config: {},
          },
        ],
      },
    },
  ],
}
