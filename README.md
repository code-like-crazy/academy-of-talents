# Academy of Talents

## Project Structure
```
.
├── frontend/           # Next.js frontend application
│   ├── app/            # Next.js app directory (pages and layouts)
│   ├── components/     # Reusable React components
│   ├── config/         # Configuration files
│   ├── lib/            # Utility functions and shared code
│   ├── public/         # Static assets
│   └── middleware.ts   # Next.js middleware
└── backend/            # Backend server
```
## How to Run
Create a `.env.local` in `/frontend`
```
NEXT_PUBLIC_GEMINI_API_KEY=<GEMINI_API_KEY>
TURSO_DATABASE_URL=<TURSO_DATABASE_URL>
TURSO_AUTH_TOKEN=<TURSO_AUTH_TOKEN>

AUTH_SECRET=<AUTH_SECRET>
NEXTAUTH_SECRET=<NEXTAUTH_SECRET>

AUTH_URL=<LOCALHOST_3000>

GOOGLE_API_KEY=<GOOGLE API KEY>
SYNTHESIS_URL=<LOCAL_HOST_OR_NGROK>
```
You can then copy this as `.env` to `/backend`
### Backend
```shell
# go to backend folder
cd backend

# init and activate venv
python3 -m venv venv && source venv/bin/activate

# install requirements
pip install -r requirements.txt

# run backend
python main.py
```
### Frontend
```shell
# go to frontend folder
cd frontend

# install dependencies
pnpm i

# run app
pnpm run dev
```

## References
### Three JS Tutorial
https://youtu.be/_bi4Ol0QEL4?si=jGMY1ViRIgE7X1mp
### Models
- [Classroom model](https://sketchfab.com/3d-models/anime-classroom-6e17b75780c044429323cd7ab6a5b83c)
- [Teacher model](https://sketchfab.com/3d-models/zero-two-a2dec30168e9454a97e83ad331ab859c)

- Road block by Luca Regazzi (okon3) [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/e3QRTZLNQU5)
- Floor Grass Sliced B by Isa Lousberg (https://poly.pizza/m/UMKvhGhK90)

- Bus by jeremy [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/bsvS0E1eo4R)
- Train by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/7UGWg1k6Pwp)
### Sound Effects
- [Quack](https://pixabay.com/sound-effects/075176-duck-quack-40345/)