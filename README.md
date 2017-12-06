# eBay eBay API Product Search Chat Bot Web Service

A simple express http server for use as the webhook for a Dialogflow agent.

* [View source code](https://github.com/christylaguardia/ai-chat-bot-webhook)
* [View web app](https://ebay-chat-bot.herokuapp.com/)
* [View the web source code](https://ebay-chat-bot.herokuapp.com/)

## Reponse

* POST `https://ai-chat-bot-webhook.herokuapp.com/`
* Headers: Content-type: application/json
* Response is specialy formatted for the bot

```
{
  speech: 'Hey! I'm Christy's shopping chat bot. Tell me how I can help you.',
  displayText: 'Hey! I'm Christy's shopping chat bot. Tell me how I can help you.'
}
```

## Reference

* https://developers.google.com/actions/reference/v1/dialogflow-webhook
* https://dialogflow.com/docs/fulfillment#section-format-of-request-to-the-service