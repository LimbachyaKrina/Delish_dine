from pymongo import MongoClient
from dotenv import load_dotenv
import os

def connect_to_database():
    mongo = os.getenv('MONGODB_URI')
    client = MongoClient(
        mongo
    )
    db = client["Test_group_project"]["userbase"]
    return db, client


