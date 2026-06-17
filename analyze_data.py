import math

data = {
    'Screen Time': [7, 4, 8, 3, 6, 9, 5, 7, 4, 6],
    'Social Media': [4, 2, 5, 1, 3, 6, 2, 4, 1, 3],
    'Study Time': [2, 5, 1, 6, 3, 1, 4, 2, 6, 3],
    'Sleep': [5, 7, 4, 8, 6, 4, 7, 5, 8, 6],
    'Apps Used': [15, 10, 18, 8, 12, 20, 11, 16, 9, 13],
    'Productivity Score': [5, 8, 4, 9, 6, 3, 7, 5, 9, 6]
}

def mean(data):
    return sum(data) / len(data)

def variance(data):
    m = mean(data)
    return sum((x - m) ** 2 for x in data) / (len(data) - 1)

def std_dev(data):
    return math.sqrt(variance(data))

def covariance(x, y):
    mx = mean(x)
    my = mean(y)
    return sum((xi - mx) * (yi - my) for xi, yi in zip(x, y)) / (len(x) - 1)

def correlation(x, y):
    return covariance(x, y) / (std_dev(x) * std_dev(y))

columns = ['Screen Time', 'Social Media', 'Study Time', 'Sleep', 'Apps Used', 'Productivity Score']

print("--- Statistics ---")
for col in columns:
    m = mean(data[col])
    v = variance(data[col])
    s = std_dev(data[col])
    print(f"{col}: Mean={m:.2f}, Var={v:.2f}, Std={s:.2f}")

print("\n--- Correlation with Productivity Score ---")
ps = data['Productivity Score']
for col in columns:
    if col != 'Productivity Score':
        corr = correlation(data[col], ps)
        print(f"{col}: {corr:.4f}")

print("\n--- Correlation (without Social Media) ---")
# Remaining are Screen Time, Study Time, Sleep, Apps Used
# But Part C specifically asks about association among remaining variables
remaining = ['Screen Time', 'Study Time', 'Sleep', 'Apps Used']
for col in remaining:
    corr = correlation(data[col], ps)
    print(f"{col}: {corr:.4f}")
