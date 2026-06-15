# Architecture

```mermaid
flowchart LR
  A["Customer inquiry text"] --> B["Intake classifier"]
  B --> C["Compliance gate"]
  C -->|allowed| D["Qwen Cloud agent planner"]
  C -->|restricted| X["Blocked response"]
  D --> E["Quote architect"]
  D --> F["Customer reply generator"]
  D --> G["Fulfillment planner"]
  E --> H["Order draft"]
  F --> I["Customer-facing response"]
  G --> J["Delivery packet preview"]
  H --> K["Payment confirmation checkpoint"]
  J --> L["Release after payment"]
```

## Runtime Modes

- `qwen-cloud`: uses the Qwen Cloud OpenAI-compatible API.
- `deterministic-demo`: no key required; useful for judging, CI, and demos.
- `deterministic-fallback`: used if the live API is unavailable.

## Deployment

The app can run on Alibaba Cloud ECS as a simple Node.js process:

```bash
npm install
npm run start
```

Bind to `127.0.0.1` by default and put it behind a managed HTTPS reverse proxy only when a public demo is needed.
