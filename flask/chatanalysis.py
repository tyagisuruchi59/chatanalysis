# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from chat_model import collect_data, preprocess_data, train_sentiment_model, predict_sentiment, load_model

# # Initialize Flask app and model
# app = Flask(__name__)
# CORS(app)
# chat_analysis_model = ChatAnalysisModel()  # Instantiate your ML model

# @app.route('/analyze', methods=['POST'])
# def analyze_chat():
#     chat_data = request.json
    
#     if not chat_data or 'messages' not in chat_data:
#         return jsonify({'error': 'Invalid input. Please provide chat messages.'}), 400
    
#     # Extract messages from the data
#     messages = chat_data['messages']
    
#     # Use your ML model to analyze chat
#     try:
#         sentiment = chat_analysis_model.predict_sentiment(messages)
#         emoji_analysis = chat_analysis_model.analyze_emojis(messages)
#         language_detection = chat_analysis_model.detect_language(messages)
#         timeline = chat_analysis_model.extract_timeline(messages)
#         preprocessing_info = chat_analysis_model.preprocess_chat(messages)
        
#         # Combine all results into a response
#         return jsonify({
#             'sentiment': sentiment,
#             'emoji': emoji_analysis,
#             'language': language_detection,
#             'timeline': timeline,
#             'preprocessing': preprocessing_info
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from chat_model import preprocess_data, train_sentiment_model, predict_sentiment, load_model

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)

# # Load a pre-trained sentiment analysis model
# # Make sure the model file (e.g., 'sentiment_model.pkl') is in the appropriate location
# model_path = 'sentiment_model.pkl'
# try:
#     sentiment_model = load_model(model_path)
# except FileNotFoundError:
#     sentiment_model = None
#     print(f"Error: Model file '{model_path}' not found. Ensure the model is trained and saved.")

# @app.route('/analyze', methods=['POST'])
# def analyze_chat():
#     chat_data = request.json
    
#     if not chat_data or 'messages' not in chat_data:
#         return jsonify({'error': 'Invalid input. Please provide chat messages.'}), 400
    
#     # Extract messages from the data
#     messages = chat_data['messages']
    
#     try:
#         # Preprocess chat messages
#         processed_messages = preprocess_data(messages)
        
#         # Predict sentiment if the model is loaded
#         sentiment = predict_sentiment(sentiment_model, processed_messages) if sentiment_model else 'Model not loaded'

#         # Placeholder for other analyses
#         emoji_analysis = "Emoji analysis not implemented"
#         language_detection = "Language detection not implemented"
#         timeline = "Timeline extraction not implemented"
        
#         # Combine all results into a response
#         return jsonify({
#             'sentiment': sentiment,
#             'emoji': emoji_analysis,
#             'language': language_detection,
#             'timeline': timeline,
#             'preprocessing': processed_messages
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from chat_model import preprocess_data, train_sentiment_model, predict_sentiment, load_model
# import numpy as np

# app = Flask(__name__)
# CORS(app, resources={r"/analyze": {"origins": "http://localhost:3000"}})

# model_path = 'sentiment_model.pkl'
# try:
#     sentiment_model = load_model(model_path)
# except FileNotFoundError:
#     sentiment_model = train_sentiment_model()
#     save_model(sentiment_model, model_path)

# @app.route('/analyze', methods=['POST'])
# def analyze_chat():
#     chat_data = request.json
    
#     if not chat_data or 'messages' not in chat_data:
#         return jsonify({'error': 'Invalid input. Please provide chat messages.'}), 400
    
#     messages = chat_data['messages']
    
#     try:
#         processed_messages = preprocess_data(messages)
        
#         # Sentiment Analysis
#         sentiments = predict_sentiment(sentiment_model, processed_messages)
        
#         # Convert numpy array to list for JSON serialization
#         sentiments_list = sentiments.tolist() if hasattr(sentiments, 'tolist') else sentiments

#         return jsonify({
#             'sentiment': sentiments_list,
#             'sentimentCounts': {
#                 'positive': int(np.sum(sentiments > 0)),
#                 'negative': int(np.sum(sentiments < 0)),
#                 'neutral': int(np.sum(sentiments == 0))
#             },
#             'emoji': "Basic emoji analysis",
#             'language': "English",
#             'timeline': "Basic timeline",
#             'preprocessing': processed_messages
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
from chat_model import preprocess_data, train_sentiment_model, predict_sentiment, load_model, save_model
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/analyze": {"origins": "http://localhost:3000"}})

model_path = 'sentiment_model.pkl'
try:
    sentiment_model = load_model(model_path)
except FileNotFoundError:
    sentiment_model = train_sentiment_model()
    save_model(sentiment_model, model_path)

@app.route('/analyze', methods=['POST'])
def analyze_chat():
    chat_data = request.json

    if not chat_data or 'messages' not in chat_data:
        return jsonify({'error': 'Invalid input. Please provide chat messages.'}), 400

    messages = chat_data['messages']

    try:
        processed_messages = preprocess_data(messages)
        print("Processed Messages:", processed_messages)  # Debugging statement

        # Sentiment Analysis
        sentiments = predict_sentiment(sentiment_model, processed_messages)
        print("Sentiments:", sentiments)  # Debugging statement

        # Convert numpy array to list for JSON serialization
        sentiments_list = sentiments.tolist() if hasattr(sentiments, 'tolist') else sentiments

        return jsonify({
            'sentiment': sentiments_list,
            'sentimentCounts': {
                'positive': int(np.sum(sentiments > 0)),
                'negative': int(np.sum(sentiments < 0)),
                'neutral': int(np.sum(sentiments == 0))
            },
            'emoji': "Basic emoji analysis",
            'language': "English",
            'timeline': "Basic timeline",
            'preprocessing': processed_messages
        })
    except Exception as e:
        print("Error:", str(e))  # Debugging statement
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
