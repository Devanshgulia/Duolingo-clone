import hashlib
import hmac
import base64
import time
import os
from typing import Optional
from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User

# Secret key for token signatures
SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "duolingo-clone-super-secret-auth-key-2026")
TOKEN_EXPIRE_SECONDS = 30 * 24 * 3600  # 30 days

def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 with a random salt."""
    salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    """Verify a plain password against the stored hash."""
    if not hashed_password:
        return False
    try:
        if "$" in hashed_password:
            salt, key_hex = hashed_password.split("$", 1)
            new_key = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000)
            return hmac.compare_digest(new_key.hex(), key_hex)
        else:
            # Fallback legacy check
            return plain_password == hashed_password
    except Exception:
        return False

def create_access_token(user_id: int) -> str:
    """Generate a signed, tamper-proof bearer token with timestamp."""
    timestamp = int(time.time())
    payload = f"{user_id}:{timestamp}"
    signature = hmac.new(SECRET_KEY.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
    token_str = f"{payload}:{signature}"
    return base64.urlsafe_b64encode(token_str.encode('utf-8')).decode('utf-8')

def decode_access_token(token: str) -> Optional[int]:
    """Decode and verify access token, returning user_id if valid."""
    try:
        decoded = base64.urlsafe_b64decode(token.encode('utf-8')).decode('utf-8')
        parts = decoded.split(":")
        if len(parts) != 3:
            return None
        user_id_str, timestamp_str, signature = parts
        user_id = int(user_id_str)
        timestamp = int(timestamp_str)

        # Check expiration
        if time.time() - timestamp > TOKEN_EXPIRE_SECONDS:
            return None

        # Verify signature
        payload = f"{user_id}:{timestamp}"
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_sig):
            return None

        return user_id
    except Exception:
        return None

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Extract user from Bearer token in Authorization header.
    If no token is present, fall back to default 'learner' or first user for demo/guest access.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
        user_id = decode_access_token(token)
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
        # If an explicit token was supplied but invalid
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fallback to demo user if unauthenticated
    user = db.query(User).filter(User.username == "learner").first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No user found in database")
    return user

def require_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """Strict authentication dependency that requires a valid token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization[7:].strip()
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found")
    return user
