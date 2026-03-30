import os
import json
import time
from typing import Any, Callable
from functools import wraps

# Redis is used when REDIS_URL is set (e.g. on AWS), otherwise falls back to in-memory
_redis = None
try:
    import redis
    _url = os.getenv("REDIS_URL")
    if _url:
        _redis = redis.from_url(_url, decode_responses=True)
        _redis.ping()
except Exception:
    _redis = None

_memory_store: dict[str, tuple[Any, float]] = {}


def _make_key(fn_name: str, args: tuple, kwargs: dict) -> str:
    def normalize(v: Any) -> Any:
        if isinstance(v, list):
            return tuple(v)
        return v
    normalized_args = tuple(normalize(a) for a in args)
    normalized_kwargs = tuple(sorted((k, normalize(v)) for k, v in kwargs.items()))
    return f"nba_cache:{fn_name}:{str((normalized_args, normalized_kwargs))}"


def _get(key: str) -> Any | None:
    if _redis:
        raw = _redis.get(key)
        return json.loads(raw) if raw is not None else None
    entry = _memory_store.get(key)
    if entry:
        value, expires_at = entry
        if time.time() < expires_at:
            return value
        del _memory_store[key]
    return None


def _set(key: str, value: Any, ttl: int) -> None:
    if _redis:
        _redis.setex(key, ttl, json.dumps(value))
    else:
        _memory_store[key] = (value, time.time() + ttl)


def cached(ttl: int) -> Callable:
    def decorator(fn: Callable) -> Callable:
        @wraps(fn)
        def wrapper(*args, **kwargs):
            key = _make_key(fn.__name__, args, kwargs)
            cached_value = _get(key)
            if cached_value is not None:
                return cached_value
            result = fn(*args, **kwargs)
            _set(key, result, ttl)
            return result
        return wrapper
    return decorator
