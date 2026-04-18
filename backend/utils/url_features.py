import re
import math

def get_url_features(url):
    features = {}

    # Length of URL
    features['length'] = len(url)

    # Count dots
    features['dots'] = url.count('.')

    # Check @ symbol
    features['has_at'] = 1 if '@' in url else 0

    # Check https
    features['https'] = 1 if url.startswith("https") else 0

    # Entropy (randomness)
    prob = [float(url.count(c)) / len(url) for c in dict.fromkeys(list(url))]
    entropy = -sum([p * math.log(p) / math.log(2.0) for p in prob])
    features['entropy'] = entropy

    return list(features.values())