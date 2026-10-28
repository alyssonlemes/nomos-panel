# nomos-panel

Painel interno da equipe Nomos. Acompanha escritórios, usuários, clientes, processos e convites que já existem na API.

O acesso deste painel não é o login de um escritório. As credenciais ficam no `.env` (`PANEL_EMAIL` e `PANEL_PASSWORD`).

## Desenvolvimento

```bash
cp .env.example .env
npm install
npm run dev
```

Abre em [http://localhost:3004](http://localhost:3004).

`DATABASE_URL` é a mesma connection string da `nomos-api`. O sistema dos escritórios continua no `nomos-web` (porta 3000).
