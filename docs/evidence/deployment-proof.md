# Deployment Proof

This public proof summarizes the deployment environment without exposing hostnames, secrets, private network details, or credentials.

| Field | Value |
| --- | --- |
| Generated at | 2026-06-15T15:26:57.921Z |
| Declared cloud provider | Alibaba Cloud ECS |
| Platform | win32 10.0.26100 x64 |
| CPU cores | 8 |
| Memory | 15.48 GB |
| Node | v24.15.0 |
| npm | 11.12.1 |
| Default bind | 127.0.0.1:8787 |

## Verification Commands

- `npm run validate`
- `npm run live:smoke`
- `npm run start`

## Security Notes

- No .env file is committed.
- Payment confirmation remains a human or official merchant API gate.
- Restricted requests are blocked before quote generation.
- The app binds to localhost by default.
