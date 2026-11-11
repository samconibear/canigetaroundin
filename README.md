# teetime

A golf tee time calculator hosted at [teetime.sconi.io](teetime.sconi.io).

Enter your round duration (9 or 18 holes, hours and minutes) and it tells you the latest you can tee off to finish before dark.

It calculates today's sunset and civil twilight times from your GPS location using a solar position algorithm, falling back to Cuddington Golf Club in Surrey if geolocation is unavailable.

## Structure

```
www/     React + Vite + Tailwind frontend
infra/   AWS CDK deployment (CloudFront + S3 via genesis-cdk)
```

## Development

```bash
cd www
npm install
npm run dev
```

## Deploy

```bash
cd www && npm run build

cd infra
npx cdk deploy
```

Deploys to `eu-west-2` by default. Requires `CDK_DEFAULT_ACCOUNT` and optionally `CDK_DEFAULT_REGION` to be set.
