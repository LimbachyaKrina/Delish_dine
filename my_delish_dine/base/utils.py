from pymongo import MongoClient
from dotenv import load_dotenv
import os

def connect_to_database():
    mongo = os.getenv('mongodb+srv://krashmeh:krish1407%3F%3F@cluster0.kesohfj.mongodb.net/')
    client = MongoClient(
        mongo
    )
    db = client["Test_group_project"]["userbase"]
    return db, client


