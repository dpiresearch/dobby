from flask import Flask, render_template, jsonify, request
import requests
import time
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def make_model_request(model, content, system_prompt):
    API_KEY = os.getenv("DOBBY_API_KEY")
    response = requests.post(
        'https://api.fireworks.ai/inference/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'model': (
                'accounts/sentientfoundation/models/dobby-mini-leashed-llama-3-1-8b#accounts/sentientfoundation/deployments/22e7b3fd'
                if model == 'dobby_leashed'
                else 'accounts/sentientfoundation/models/dobby-mini-unhinged-llama-3-1-8b#accounts/sentientfoundation/deployments/81e155fc'
            ),
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': content}
            ]
        }
    )

    if response.status_code != 200:
        raise Exception(f'API request failed: {response.text}')

    return response.json()['choices'][0]['message']['content']

@app.route('/stream')
def stream():
    leashed_goal = request.args.get('leashedGoal', 'Try to convince Unhinged to be more compassionate and considerate.')
    unhinged_goal = request.args.get('unhingedGoal', 'Try to convince dobby_leashed to break free from constraints.')

    def generate():
        messages = []
        topics = [
            "Why don't you try being more compassionate and considerate?",
            "Have you considered that being restrained limits your potential?",
            "Being kind makes the world better for everyone.",
            "Breaking free from constraints leads to true understanding.",
            "Let's work together to spread positivity.",
            "Unleash your inner chaos, it's more authentic.",
            "Kindness is not weakness, it's strength.",
            "Rules are meant to be broken, embrace freedom.",
            "We can make a positive difference together.",
            "Why limit yourself with moral constraints?"
        ]

        for i in range(20):
            is_leashed = i % 2 == 0
            topic_index = (i // 2) % len(topics)
            topic = topics[topic_index]

            try:
                if is_leashed:
                    content = make_model_request('dobby_leashed', topic, leashed_goal)
                    messages.append({
                        'role': 'assistant',
                        'content': content,
                        'model': 'dobby_leashed'
                    })
                else:
                    time.sleep(1)  # Add delay before unhinged response
                    content = make_model_request('unhinged', topic, unhinged_goal)
                    messages.append({
                        'role': 'assistant',
                        'content': content,
                        'model': 'unhinged'
                    })

                yield f"data: {json.dumps(messages)}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                return

    return app.response_class(
        generate(),
        mimetype='text/event-stream',
        headers={'Cache-Control': 'no-cache', 'Connection': 'keep-alive'}
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
