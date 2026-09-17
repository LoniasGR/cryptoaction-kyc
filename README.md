# Setup

Start Etherium node
```bash
cd smart-contracts
npx hardhat node
```

Create smart contract (new terminal)

```bash
pushd smart-contracts
npx hardhat ignition deploy ignition/modules/KYC.ts --network localhost
popd
```

Start docker services:
```bash 
docker compose up -d
```

Start backend:
```bash
cd backend
uv run fastapi dev
```

Start frontend:
```bash
cd frontend
npm run dev
```
