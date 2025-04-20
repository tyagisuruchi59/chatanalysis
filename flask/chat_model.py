import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle

# Function to collect data from a file
def collect_data(chat_dataset):
    with open(chat_dataset, 'r') as file:
        data = file.read().splitlines()
    return data

# Initialize the spaCy model
nlp = spacy.load('en_core_web_sm')

# Preprocess the data using spaCy for lemmatization and stop word removal
def preprocess_data(data):
    processed_data = []
    for line in data:
        doc = nlp(line.lower())
        tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
        processed_data.append(' '.join(tokens))
    return processed_data

# Train a sentiment analysis model (example using Naive Bayes)
def train_sentiment_model(data, labels):
    vectorizer = TfidfVectorizer()
    model = MultinomialNB()
    pipeline = make_pipeline(vectorizer, model)

    X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)
    predictions = pipeline.predict(X_test)
    print(classification_report(y_test, predictions))
    return pipeline

# Save a trained model
def save_model(model, filename='sentiment_model.pkl'):
    with open(filename, 'wb') as file:
        pickle.dump(model, file)

# Load a saved model
def load_model(filename='sentiment_model.pkl'):
    with open(filename, 'rb') as file:
        return pickle.load(file)

# Example sentiment prediction
def predict_sentiment(model, messages):
    return model.predict(messages)

# If the script is run directly, train and save the model
if __name__ == '__main__':
    # Update this path to the correct location of your chat dataset file
    chat_dataset = 'chat_dataset.txt'

    # Collect data
    try:
        data = collect_data(chat_dataset)
        print("Collected Data:", data)  # Debugging statement
    except FileNotFoundError:
        print(f"File not found: {chat_dataset}")
        exit(1)

    # Preprocess data
    processed_data = preprocess_data(data)
    print("Processed Data:", processed_data)  # Debugging statement

    # Ensure the number of labels matches the number of data samples
    labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]  # Example labels (1 for positive, 0 for negative)

    if len(processed_data) != len(labels):
        print(f"Error: Number of data samples ({len(processed_data)}) does not match number of labels ({len(labels)})")
        exit(1)

    # Train the model
    sentiment_model = train_sentiment_model(processed_data, labels)

    # Save the model
    save_model(sentiment_model)
    print("Model trained and saved successfully!")



# import spacy
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.pipeline import make_pipeline
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report
# import pickle
# import numpy as np

# # Initialize the spaCy model
# nlp = spacy.load('en_core_web_sm')

# # Preprocess the data using spaCy for lemmatization and stop word removal
# def preprocess_data(data):
#     processed_data = []
#     for line in data:
#         doc = nlp(line.lower())
#         tokens = [token.lemma_ for token in doc if token.is_alpha and not token.is_stop]
#         processed_data.append(' '.join(tokens))
#     return processed_data

# # Create a sample training dataset
# def create_sample_training_data():
#     # Sample texts with labels (0 = negative, 1 = positive)
#     texts = [
#         "I'm really happy with this conversation",
#         "This is amazing and wonderful",
#         "I'm feeling great today",
#         "I'm frustrated and angry",
#         "This is terrible and disappointing",
#         "I'm sad and upset",
#         "Neutral statement about something",
#         "Another neutral comment",
#         "Just an average day"
#     ]
#     labels = [1, 1, 1, 0, 0, 0, 2, 2, 2]  # 0: negative, 1: positive, 2: neutral
#     return texts, labels

# # Train a sentiment analysis model
# def train_sentiment_model():
#     # Create sample training data
#     texts, labels = create_sample_training_data()
    
#     # Preprocess the texts
#     processed_texts = preprocess_data(texts)
    
#     # Split the data
#     X_train, X_test, y_train, y_test = train_test_split(processed_texts, labels, test_size=0.2, random_state=42)
    
#     # Create a pipeline with TF-IDF vectorization and Naive Bayes classifier
#     pipeline = make_pipeline(TfidfVectorizer(), MultinomialNB())
    
#     # Train the model
#     pipeline.fit(X_train, y_train)
    
#     # Evaluate the model
#     predictions = pipeline.predict(X_test)
#     print(classification_report(y_test, predictions))
    
#     return pipeline

# # Save the trained model
# def save_model(model, filename='sentiment_model.pkl'):
#     with open(filename, 'wb') as file:
#         pickle.dump(model, file)

# # Load a saved model
# def load_model(filename='sentiment_model.pkl'):
#     with open(filename, 'rb') as file:
#         return pickle.load(file)

# # Predict sentiment
# def predict_sentiment(model, messages):
#     return model.predict(messages)

# # If the script is run directly, train and save the model
# if __name__ == '__main__':
#     # Train the model
#     sentiment_model = train_sentiment_model()
    
#     # Save the model
#     save_model(sentiment_model)
#     print("Model trained and saved successfully!")
