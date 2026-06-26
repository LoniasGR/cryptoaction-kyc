import os

from dotenv import load_dotenv

load_dotenv()

# DB_URL = "sqlite:///database.db"
DB_URL = f"postgresql+psycopg://{os.getenv('APP_DB_USER')}:{os.getenv('APP_DB_PASSWORD')}@127.0.0.1:5432/{os.getenv('APP_DB_NAME')}"
