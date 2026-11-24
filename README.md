# TraducAI website (traduc.ai)

The public website for TraducAI. Plain static files, no build step:

- `index.html`: the page
- `styles.css`: the theme, the same tokens as the app (traducai_ui)
- `script.js`: hero captions, the language list, scroll effects
- `favicon.svg`: the brand mark

Links go to the app on https://app.traduc.ai (`/signup`, `/login`). The language list in `script.js` is a copy of
`https://relay.traduc.ai/api/languages` (60 languages, 29 with voice); update it when the relay's list changes.

## Preview

Open `index.html` in a browser, or run any static server in this folder.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml` on the self-hosted runner, which copies the site to
`/home/traduc` on the server. "Run workflow" on the Actions tab redeploys without a change.

One-time server setup:

1. Register a self-hosted runner for this repository (Settings > Actions > Runners > New self-hosted runner, Linux),
   in its own folder such as `/home/actions-runner-traduc-website`, then `sudo ./svc.sh install && sudo ./svc.sh start`.
2. Point the DNS of `traduc.ai` and `www.traduc.ai` (A records) to the server.
3. Add the nginx site, for example `/etc/nginx/sites-available/traduc.ai`:

   ```nginx
   server {
     listen 80;
     server_name traduc.ai www.traduc.ai;
     root /home/traduc;
     index index.html;
     location / { try_files $uri $uri/ =404; }
   }
   ```

   then `ln -s /etc/nginx/sites-available/traduc.ai /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx`.
4. Add HTTPS: `certbot --nginx -d traduc.ai -d www.traduc.ai`.
