import os

from dotenv import load_dotenv

from ..utils import parse_duration

load_dotenv()

# DB_URL = "sqlite:///database.db"
DB_URL = f"postgresql+psycopg://{os.getenv('APP_DB_USER')}:{os.getenv('APP_DB_PASSWORD')}@127.0.0.1:5432/{os.getenv('APP_DB_NAME')}"
IPFS_MULTIADDR = os.getenv("IPFS_MULTIADDR", "/dns4/localhost/tcp/5001")
EXPIRATION_TIME = parse_duration(os.getenv("EXPIRATION_TIME", "3M"))
