import re


def parse_duration(duration_str):
    match = re.match(r"(\d+)([smhdwMY])", duration_str)
    if not match:
        raise ValueError(f"Invalid duration format: {duration_str}")
    value, unit = match.groups()
    value = int(value)
    if unit == "s":
        return value
    elif unit == "m":
        return value * 60
    elif unit == "h":
        return value * 60 * 60
    elif unit == "d":
        return value * 60 * 60 * 24
    elif unit == "w":
        return value * 60 * 60 * 24 * 7
    elif unit == "M":
        return value * 60 * 60 * 24 * 30
    elif unit == "Y":
        return value * 60 * 60 * 24 * 365
    else:
        raise ValueError(f"Unknown duration unit: {unit}")
