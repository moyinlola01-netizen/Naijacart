# ============================================================
# CART E-COMMERCE — FLASK BACKEND
# Python + Flask + SQLite
# ============================================================

import os
import re
import secrets
import sqlite3
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash


# ============================================================
# APP CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

DB_DIR = os.path.join(PROJECT_DIR, "db")
DATABASE = os.path.join(DB_DIR, "cart.db")
FRONTEND_DIR = os.path.join(PROJECT_DIR, "cart-frontend")

os.makedirs(DB_DIR, exist_ok=True)

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}}
)


# ============================================================
# DATABASE
# ============================================================

def get_db():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def close_db(db):
    if db:
        db.close()


def init_database():
    db = get_db()

    try:
        db.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                phone TEXT,
                role TEXT NOT NULL DEFAULT 'customer',
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS auth_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                used INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT NOT NULL,
                price REAL NOT NULL DEFAULT 0,
                old_price REAL,
                discount REAL NOT NULL DEFAULT 0,
                image TEXT,
                rating REAL NOT NULL DEFAULT 0,
                review_count INTEGER NOT NULL DEFAULT 0,
                stock INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                order_number TEXT NOT NULL UNIQUE,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                postal_code TEXT,
                payment_method TEXT NOT NULL,
                note TEXT,
                subtotal REAL NOT NULL DEFAULT 0,
                delivery_fee REAL NOT NULL DEFAULT 0,
                total REAL NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                product_name TEXT NOT NULL,
                product_image TEXT,
                price REAL NOT NULL DEFAULT 0,
                quantity INTEGER NOT NULL DEFAULT 1,
                size TEXT,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id)
            );

            CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                size TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                UNIQUE(user_id, product_id, size),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
        """)

        db.commit()

    finally:
        close_db(db)


# ============================================================
# HELPERS
# ============================================================

def now():
    return datetime.utcnow().isoformat()


def future_time(minutes):
    return (
        datetime.utcnow() + timedelta(minutes=minutes)
    ).isoformat()


def success_response(message, data=None, status=200):
    response = {
        "success": True,
        "message": message
    }

    if data is not None:
        response["data"] = data

    return jsonify(response), status


def error_response(message, status=400):
    return jsonify({
        "success": False,
        "message": message
    }), status


def valid_email(email):
    return bool(
        email and
        re.match(
            r"^[^@\s]+@[^@\s]+\.[^@\s]+$",
            email
        )
    )


def valid_phone(phone):
    if not phone:
        return False

    cleaned = re.sub(
        r"[\s\-()]+",
        "",
        phone
    )

    return bool(
        re.match(
            r"^(\+234|0)[789][01]\d{8}$",
            cleaned
        )
    )


def user_to_dict(user):
    if not user:
        return None

    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "email": user["email"],
        "phone": user["phone"],
        "role": user["role"],
        "is_active": bool(user["is_active"]),
        "created_at": user["created_at"]
    }


def create_auth_token(user_id):
    db = get_db()

    try:
        token = secrets.token_urlsafe(48)

        db.execute(
            "DELETE FROM auth_tokens WHERE user_id = ?",
            (user_id,)
        )

        db.execute("""
            INSERT INTO auth_tokens
            (user_id, token, expires_at, created_at)
            VALUES (?, ?, ?, ?)
        """, (
            user_id,
            token,
            future_time(60 * 24 * 30),
            now()
        ))

        db.commit()

        return token

    finally:
        close_db(db)


def get_user_from_token(token):
    if not token:
        return None

    db = get_db()

    try:
        return db.execute("""
            SELECT users.*
            FROM auth_tokens
            JOIN users
                ON users.id = auth_tokens.user_id
            WHERE auth_tokens.token = ?
              AND auth_tokens.expires_at > ?
              AND users.is_active = 1
        """, (
            token,
            now()
        )).fetchone()

    finally:
        close_db(db)


def get_request_token():
    authorization = request.headers.get(
        "Authorization",
        ""
    )

    if authorization.startswith("Bearer "):
        return authorization[7:].strip()

    return (
        request.headers.get("X-Auth-Token")
        or request.args.get("token")
        or ""
    )


def login_required(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):

        user = get_user_from_token(
            get_request_token()
        )

        if not user:
            return error_response(
                "Authentication required. Please log in.",
                401
            )

        return route_function(
            user,
            *args,
            **kwargs
        )

    return wrapper


def admin_required(route_function):
    @wraps(route_function)
    @login_required
    def wrapper(user, *args, **kwargs):

        if user["role"] != "admin":
            return error_response(
                "Administrator access required.",
                403
            )

        return route_function(
            user,
            *args,
            **kwargs
        )

    return wrapper


# ============================================================
# API HEALTH
# ============================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Cart API is running.",
        "database": "SQLite",
        "status": "online"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Cart backend is healthy."
    })


# ============================================================
# REGISTER
# ============================================================

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json(
        silent=True
    ) or {}

    full_name = str(
        data.get(
            "full_name",
            data.get("name", "")
        )
    ).strip()

    email = str(
        data.get("email", "")
    ).strip().lower()

    password = str(
        data.get("password", "")
    )

    phone = str(
        data.get("phone", "")
    ).strip()

    if len(full_name) < 2:
        return error_response(
            "Please enter your full name."
        )

    if not valid_email(email):
        return error_response(
            "Please enter a valid email address."
        )

    if len(password) < 8:
        return error_response(
            "Password must be at least 8 characters."
        )

    if phone and not valid_phone(phone):
        return error_response(
            "Please enter a valid Nigerian phone number."
        )

    db = get_db()

    try:

        existing = db.execute(
            """
            SELECT id
            FROM users
            WHERE email = ?
            """,
            (email,)
        ).fetchone()

        if existing:
            return error_response(
                "An account with this email already exists.",
                409
            )

        timestamp = now()

        password_hash = generate_password_hash(
            password
        )

        cursor = db.execute("""
            INSERT INTO users
            (
                full_name,
                email,
                password,
                phone,
                role,
                is_active,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            full_name,
            email,
            password_hash,
            phone,
            "customer",
            1,
            timestamp,
            timestamp
        ))

        db.commit()

        user_id = cursor.lastrowid

        user = db.execute(
            """
            SELECT *
            FROM users
            WHERE id = ?
            """,
            (user_id,)
        ).fetchone()

        token = create_auth_token(
            user_id
        )

        return success_response(
            "Account created successfully.",
            {
                "user": user_to_dict(user),
                "token": token
            },
            201
        )

    finally:
        close_db(db)


# ============================================================
# LOGIN
# ============================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json(
        silent=True
    ) or {}

    email = str(
        data.get("email", "")
    ).strip().lower()

    password = str(
        data.get("password", "")
    )

    if not email or not password:
        return error_response(
            "Email and password are required."
        )

    db = get_db()

    try:

        user = db.execute(
            """
            SELECT *
            FROM users
            WHERE email = ?
            """,
            (email,)
        ).fetchone()

        if not user or not check_password_hash(
            user["password"],
            password
        ):
            return error_response(
                "Incorrect email or password.",
                401
            )

        if not user["is_active"]:
            return error_response(
                "This account has been disabled.",
                403
            )

        token = create_auth_token(
            user["id"]
        )

        return success_response(
            "Login successful.",
            {
                "user": user_to_dict(user),
                "token": token
            }
        )

    finally:
        close_db(db)


# ============================================================
# CURRENT USER
# ============================================================

@app.route("/api/me", methods=["GET"])
@login_required
def current_user(user):

    return success_response(
        "User information retrieved.",
        {
            "user": user_to_dict(user)
        }
    )


# ============================================================
# AUTH — CURRENT USER
# FRONTEND COMPATIBILITY
# ============================================================

@app.route("/api/auth/me", methods=["GET"])
@login_required
def auth_current_user(user):

    return success_response(
        "User information retrieved.",
        {
            "user": user_to_dict(user)
        }
    )


# ============================================================
# AUTH — UPDATE PROFILE
# ============================================================

@app.route("/api/auth/profile", methods=["PUT"])
@login_required
def update_profile(user):

    data = request.get_json(
        silent=True
    ) or {}

    full_name = str(
        data.get(
            "name",
            data.get("full_name", "")
        )
    ).strip()

    email = str(
        data.get("email", "")
    ).strip().lower()

    phone = str(
        data.get("phone", "")
    ).strip()

    if len(full_name) < 2:
        return error_response(
            "Please enter your full name."
        )

    if not valid_email(email):
        return error_response(
            "Please enter a valid email address."
        )

    if phone and not valid_phone(phone):
        return error_response(
            "Please enter a valid Nigerian phone number."
        )

    db = get_db()

    try:

        existing = db.execute(
            """
            SELECT id
            FROM users
            WHERE email = ?
              AND id != ?
            """,
            (
                email,
                user["id"]
            )
        ).fetchone()

        if existing:
            return error_response(
                "Another account is already using this email.",
                409
            )

        db.execute(
            """
            UPDATE users
            SET
                full_name = ?,
                email = ?,
                phone = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                full_name,
                email,
                phone,
                now(),
                user["id"]
            )
        )

        db.commit()

        updated_user = db.execute(
            """
            SELECT *
            FROM users
            WHERE id = ?
            """,
            (user["id"],)
        ).fetchone()

        return success_response(
            "Profile updated successfully.",
            {
                "user": user_to_dict(
                    updated_user
                )
            }
        )

    finally:
        close_db(db)


# ============================================================
# AUTH — CHANGE PASSWORD
# ============================================================

@app.route("/api/auth/change-password", methods=["PUT"])
@login_required
def change_password(user):

    data = request.get_json(
        silent=True
    ) or {}

    current_password = str(
        data.get(
            "current_password",
            ""
        )
    )

    new_password = str(
        data.get(
            "new_password",
            ""
        )
    )

    if not current_password:
        return error_response(
            "Please enter your current password."
        )

    if not new_password:
        return error_response(
            "Please enter a new password."
        )

    if len(new_password) < 8:
        return error_response(
            "New password must be at least 8 characters."
        )

    if current_password == new_password:
        return error_response(
            "Your new password must be different from your current password."
        )

    if not check_password_hash(
        user["password"],
        current_password
    ):
        return error_response(
            "Your current password is incorrect.",
            401
        )

    new_password_hash = generate_password_hash(
        new_password
    )

    db = get_db()

    try:

        db.execute(
            """
            UPDATE users
            SET
                password = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                new_password_hash,
                now(),
                user["id"]
            )
        )

        db.commit()

        return success_response(
            "Password changed successfully."
        )

    finally:
        close_db(db)


# ============================================================
# LOGOUT
# ============================================================

@app.route("/api/logout", methods=["POST"])
@login_required
def logout(user):

    token = get_request_token()

    db = get_db()

    try:

        db.execute(
            """
            DELETE FROM auth_tokens
            WHERE token = ?
            """,
            (token,)
        )

        db.commit()

    finally:
        close_db(db)

    return success_response(
        "Logout successful."
    )


# ============================================================
# FORGOT PASSWORD
# ============================================================

@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():

    data = request.get_json(
        silent=True
    ) or {}

    email = str(
        data.get("email", "")
    ).strip().lower()

    if not valid_email(email):
        return error_response(
            "Please enter a valid email address."
        )

    db = get_db()

    try:

        user = db.execute(
            """
            SELECT *
            FROM users
            WHERE email = ?
              AND is_active = 1
            """,
            (email,)
        ).fetchone()

        if not user:
            return success_response(
                "If an account exists with that email, password reset instructions are available."
            )

        db.execute(
            """
            UPDATE password_reset_tokens
            SET used = 1
            WHERE user_id = ?
            """,
            (user["id"],)
        )

        reset_token = secrets.token_urlsafe(
            48
        )

        db.execute("""
            INSERT INTO password_reset_tokens
            (
                user_id,
                token,
                expires_at,
                used,
                created_at
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            user["id"],
            reset_token,
            future_time(30),
            0,
            now()
        ))

        db.commit()

        return success_response(
            "If an account exists with that email, password reset instructions are available.",
            {
                "reset_token": reset_token
            }
        )

    finally:
        close_db(db)


# ============================================================
# RESET PASSWORD
# ============================================================

@app.route("/api/reset-password", methods=["POST"])
def reset_password():

    data = request.get_json(
        silent=True
    ) or {}

    token = str(
        data.get("token", "")
    ).strip()

    password = str(
        data.get("password", "")
    )

    if not token:
        return error_response(
            "Reset token is required."
        )

    if len(password) < 8:
        return error_response(
            "Password must be at least 8 characters."
        )

    db = get_db()

    try:

        reset = db.execute(
            """
            SELECT *
            FROM password_reset_tokens
            WHERE token = ?
              AND used = 0
              AND expires_at > ?
            """,
            (
                token,
                now()
            )
        ).fetchone()

        if not reset:
            return error_response(
                "This password reset link is invalid or has expired."
            )

        password_hash = generate_password_hash(
            password
        )

        timestamp = now()

        db.execute(
            """
            UPDATE users
            SET
                password = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                password_hash,
                timestamp,
                reset["user_id"]
            )
        )

        db.execute(
            """
            UPDATE password_reset_tokens
            SET used = 1
            WHERE id = ?
            """,
            (reset["id"],)
        )

        db.execute(
            """
            DELETE FROM auth_tokens
            WHERE user_id = ?
            """,
            (reset["user_id"],)
        )

        db.commit()

        return success_response(
            "Password reset successfully."
        )

    finally:
        close_db(db)


# ============================================================
# PRODUCTS
# ============================================================

@app.route("/api/products", methods=["GET"])
def get_products():

    category = request.args.get(
        "category"
    )

    search = request.args.get(
        "search"
    )

    db = get_db()

    try:

        query = """
            SELECT *
            FROM products
            WHERE 1 = 1
        """

        parameters = []

        if category and category.lower() != "all":

            query += """
                AND category = ?
            """

            parameters.append(
                category
            )

        if search:

            query += """
                AND (
                    name LIKE ?
                    OR description LIKE ?
                    OR category LIKE ?
                )
            """

            value = f"%{search}%"

            parameters.extend([
                value,
                value,
                value
            ])

        query += """
            ORDER BY created_at DESC
        """

        products = db.execute(
            query,
            parameters
        ).fetchall()

        return jsonify({
            "success": True,
            "products": [
                dict(product)
                for product in products
            ]
        })

    finally:
        close_db(db)


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):

    db = get_db()

    try:

        product = db.execute(
            """
            SELECT *
            FROM products
            WHERE id = ?
            """,
            (product_id,)
        ).fetchone()

        if not product:
            return error_response(
                "Product not found.",
                404
            )

        return jsonify({
            "success": True,
            "product": dict(product)
        })

    finally:
        close_db(db)


# ============================================================
# CART — GET
# ============================================================

@app.route("/api/cart", methods=["GET"])
@login_required
def get_cart(user):

    db = get_db()

    try:

        rows = db.execute("""
            SELECT
                cart_items.id,
                cart_items.product_id,
                cart_items.quantity,
                cart_items.size,
                products.name,
                products.price,
                products.image,
                products.stock
            FROM cart_items
            JOIN products
                ON products.id = cart_items.product_id
            WHERE cart_items.user_id = ?
            ORDER BY cart_items.created_at DESC
        """, (
            user["id"],
        )).fetchall()

        items = [
            dict(row)
            for row in rows
        ]

        subtotal = sum(
            float(item["price"] or 0)
            * int(item["quantity"] or 1)
            for item in items
        )

        return jsonify({
            "success": True,
            "items": items,
            "subtotal": subtotal
        })

    finally:
        close_db(db)


# ============================================================
# CART — ADD
# ============================================================

@app.route("/api/cart", methods=["POST"])
@login_required
def add_to_cart(user):

    data = request.get_json(
        silent=True
    ) or {}

    product_id = data.get(
        "product_id",
        data.get("productId")
    )

    size = data.get("size")

    try:

        product_id = int(
            product_id
        )

        quantity = int(
            data.get(
                "quantity",
                1
            )
        )

    except (
        TypeError,
        ValueError
    ):

        return error_response(
            "Invalid product or quantity."
        )

    if quantity < 1:
        return error_response(
            "Quantity must be at least 1."
        )

    db = get_db()

    try:

        product = db.execute(
            """
            SELECT *
            FROM products
            WHERE id = ?
            """,
            (product_id,)
        ).fetchone()

        if not product:
            return error_response(
                "Product not found.",
                404
            )

        if product["stock"] < quantity:
            return error_response(
                "Not enough stock available."
            )

        timestamp = now()

        existing = db.execute(
            """
            SELECT *
            FROM cart_items
            WHERE user_id = ?
              AND product_id = ?
              AND (
                  size = ?
                  OR (
                      size IS NULL
                      AND ? IS NULL
                  )
              )
            """,
            (
                user["id"],
                product_id,
                size,
                size
            )
        ).fetchone()

        if existing:

            new_quantity = (
                existing["quantity"]
                + quantity
            )

            if new_quantity > product["stock"]:
                return error_response(
                    "The requested quantity exceeds available stock."
                )

            db.execute(
                """
                UPDATE cart_items
                SET
                    quantity = ?,
                    updated_at = ?
                WHERE id = ?
                """,
                (
                    new_quantity,
                    timestamp,
                    existing["id"]
                )
            )

        else:

            db.execute("""
                INSERT INTO cart_items
                (
                    user_id,
                    product_id,
                    quantity,
                    size,
                    created_at,
                    updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                user["id"],
                product_id,
                quantity,
                size,
                timestamp,
                timestamp
            ))

        db.commit()

        return success_response(
            "Product added to cart."
        )

    finally:
        close_db(db)


# ============================================================
# CART — UPDATE
# ============================================================

@app.route("/api/cart/<int:cart_id>", methods=["PUT"])
@login_required
def update_cart_item(
    user,
    cart_id
):

    data = request.get_json(
        silent=True
    ) or {}

    try:

        quantity = int(
            data.get("quantity")
        )

    except (
        TypeError,
        ValueError
    ):

        return error_response(
            "Invalid quantity."
        )

    if quantity < 1:
        return error_response(
            "Quantity must be at least 1."
        )

    db = get_db()

    try:

        item = db.execute(
            """
            SELECT
                cart_items.*,
                products.stock
            FROM cart_items
            JOIN products
                ON products.id = cart_items.product_id
            WHERE cart_items.id = ?
              AND cart_items.user_id = ?
            """,
            (
                cart_id,
                user["id"]
            )
        ).fetchone()

        if not item:
            return error_response(
                "Cart item not found.",
                404
            )

        if quantity > item["stock"]:
            return error_response(
                "Requested quantity exceeds available stock."
            )

        db.execute(
            """
            UPDATE cart_items
            SET
                quantity = ?,
                updated_at = ?
            WHERE id = ?
              AND user_id = ?
            """,
            (
                quantity,
                now(),
                cart_id,
                user["id"]
            )
        )

        db.commit()

        return success_response(
            "Cart updated."
        )

    finally:
        close_db(db)


# ============================================================
# CART — REMOVE
# ============================================================

@app.route("/api/cart/<int:cart_id>", methods=["DELETE"])
@login_required
def remove_cart_item(
    user,
    cart_id
):

    db = get_db()

    try:

        cursor = db.execute(
            """
            DELETE FROM cart_items
            WHERE id = ?
              AND user_id = ?
            """,
            (
                cart_id,
                user["id"]
            )
        )

        db.commit()

        if cursor.rowcount == 0:
            return error_response(
                "Cart item not found.",
                404
            )

        return success_response(
            "Item removed from cart."
        )

    finally:
        close_db(db)


# ============================================================
# CART — CLEAR
# ============================================================

@app.route("/api/cart", methods=["DELETE"])
@login_required
def clear_cart(user):

    db = get_db()

    try:

        db.execute(
            """
            DELETE FROM cart_items
            WHERE user_id = ?
            """,
            (user["id"],)
        )

        db.commit()

        return success_response(
            "Cart cleared."
        )

    finally:
        close_db(db)


# ============================================================
# CREATE ORDER
# ============================================================

@app.route("/api/orders", methods=["POST"])
@login_required
def create_order(user):

    data = request.get_json(
        silent=True
    ) or {}

    full_name = str(
        data.get("full_name", "")
    ).strip()

    email = str(
        data.get("email", "")
    ).strip().lower()

    phone = str(
        data.get("phone", "")
    ).strip()

    address = str(
        data.get("address", "")
    ).strip()

    city = str(
        data.get("city", "")
    ).strip()

    state = str(
        data.get("state", "")
    ).strip()

    postal_code = str(
        data.get("postal_code", "")
    ).strip()

    payment_method = str(
        data.get(
            "payment_method",
            "pay_on_delivery"
        )
    ).strip()

    note = str(
        data.get("note", "")
    ).strip()

    if len(full_name) < 2:
        return error_response(
            "Please enter your full name."
        )

    if not valid_email(email):
        return error_response(
            "Please enter a valid email address."
        )

    if not valid_phone(phone):
        return error_response(
            "Please enter a valid Nigerian phone number."
        )

    if len(address) < 5:
        return error_response(
            "Please enter your delivery address."
        )

    if len(city) < 2:
        return error_response(
            "Please enter your city."
        )

    if not state:
        return error_response(
            "Please select your state."
        )

    db = get_db()

    try:

        cart = db.execute("""
            SELECT
                cart_items.product_id,
                cart_items.quantity,
                cart_items.size,
                products.name,
                products.image,
                products.price,
                products.stock
            FROM cart_items
            JOIN products
                ON products.id = cart_items.product_id
            WHERE cart_items.user_id = ?
        """, (
            user["id"],
        )).fetchall()

        if not cart:
            return error_response(
                "Your cart is empty."
            )

        subtotal = 0

        for item in cart:

            quantity = int(
                item["quantity"]
            )

            if quantity > item["stock"]:
                return error_response(
                    f"Not enough stock for {item['name']}."
                )

            subtotal += (
                float(item["price"])
                * quantity
            )

        delivery_fee = (
            0
            if subtotal >= 100000
            else 2500
        )

        total = (
            subtotal
            + delivery_fee
        )

        order_number = (
            "CRT-"
            + datetime.utcnow().strftime(
                "%Y%m%d"
            )
            + "-"
            + secrets.token_hex(3).upper()
        )

        timestamp = now()

        cursor = db.execute("""
            INSERT INTO orders
            (
                user_id,
                order_number,
                full_name,
                email,
                phone,
                address,
                city,
                state,
                postal_code,
                payment_method,
                note,
                subtotal,
                delivery_fee,
                total,
                status,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user["id"],
            order_number,
            full_name,
            email,
            phone,
            address,
            city,
            state,
            postal_code,
            payment_method,
            note,
            subtotal,
            delivery_fee,
            total,
            "pending",
            timestamp,
            timestamp
        ))

        order_id = cursor.lastrowid

        for item in cart:

            quantity = int(
                item["quantity"]
            )

            db.execute("""
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_name,
                    product_image,
                    price,
                    quantity,
                    size
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id,
                item["product_id"],
                item["name"],
                item["image"],
                item["price"],
                quantity,
                item["size"]
            ))

            db.execute(
                """
                UPDATE products
                SET stock = stock - ?
                WHERE id = ?
                """,
                (
                    quantity,
                    item["product_id"]
                )
            )

        db.execute(
            """
            DELETE FROM cart_items
            WHERE user_id = ?
            """,
            (user["id"],)
        )

        db.commit()

        order = db.execute(
            """
            SELECT *
            FROM orders
            WHERE id = ?
            """,
            (order_id,)
        ).fetchone()

        return success_response(
            "Order placed successfully.",
            {
                "order": dict(order)
            },
            201
        )

    except Exception:

        db.rollback()
        raise

    finally:
        close_db(db)


# ============================================================
# CUSTOMER ORDERS
# ============================================================

@app.route("/api/orders", methods=["GET"])
@login_required
def get_orders(user):

    db = get_db()

    try:

        orders = db.execute(
            """
            SELECT *
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user["id"],)
        ).fetchall()

        result = []

        for order in orders:

            order_data = dict(order)

            items = db.execute(
                """
                SELECT *
                FROM order_items
                WHERE order_id = ?
                ORDER BY id ASC
                """,
                (order["id"],)
            ).fetchall()

            order_data["items"] = [
                dict(item)
                for item in items
            ]

            result.append(
                order_data
            )

        return jsonify({
            "success": True,
            "user": user_to_dict(user),
            "orders": result
        })

    finally:
        close_db(db)


@app.route(
    "/api/orders/<int:order_id>",
    methods=["GET"]
)
@login_required
def get_order(
    user,
    order_id
):

    db = get_db()

    try:

        order = db.execute(
            """
            SELECT *
            FROM orders
            WHERE id = ?
              AND user_id = ?
            """,
            (
                order_id,
                user["id"]
            )
        ).fetchone()

        if not order:
            return error_response(
                "Order not found.",
                404
            )

        items = db.execute(
            """
            SELECT *
            FROM order_items
            WHERE order_id = ?
            ORDER BY id ASC
            """,
            (order_id,)
        ).fetchall()

        order_data = dict(order)

        order_data["items"] = [
            dict(item)
            for item in items
        ]

        return jsonify({
            "success": True,
            "order": order_data
        })

    finally:
        close_db(db)


# ============================================================
# ADMIN — ORDERS
# ============================================================

@app.route(
    "/api/admin/orders",
    methods=["GET"]
)
@admin_required
def admin_orders(user):

    db = get_db()

    try:

        orders = db.execute("""
            SELECT
                orders.*,
                users.email AS account_email
            FROM orders
            JOIN users
                ON users.id = orders.user_id
            ORDER BY orders.created_at DESC
        """).fetchall()

        return jsonify({
            "success": True,
            "orders": [
                dict(order)
                for order in orders
            ]
        })

    finally:
        close_db(db)


# ============================================================
# ADMIN — UPDATE ORDER
# ============================================================

@app.route(
    "/api/admin/orders/<int:order_id>",
    methods=["PUT"]
)
@admin_required
def admin_update_order(
    user,
    order_id
):

    data = request.get_json(
        silent=True
    ) or {}

    status = str(
        data.get("status", "")
    ).strip().lower()

    allowed_statuses = {
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded"
    }

    if status not in allowed_statuses:
        return error_response(
            "Invalid order status."
        )

    db = get_db()

    try:

        cursor = db.execute(
            """
            UPDATE orders
            SET
                status = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                status,
                now(),
                order_id
            )
        )

        db.commit()

        if cursor.rowcount == 0:
            return error_response(
                "Order not found.",
                404
            )

        return success_response(
            "Order status updated."
        )

    finally:
        close_db(db)


# ============================================================
# ADMIN — ADD PRODUCT
# ============================================================

@app.route(
    "/api/admin/products",
    methods=["POST"]
)
@admin_required
def admin_add_product(user):

    data = request.get_json(
        silent=True
    ) or {}

    name = str(
        data.get("name", "")
    ).strip()

    description = str(
        data.get("description", "")
    ).strip()

    category = str(
        data.get("category", "")
    ).strip()

    image = str(
        data.get("image", "")
    ).strip()

    if not name:
        return error_response(
            "Product name is required."
        )

    if not category:
        return error_response(
            "Product category is required."
        )

    try:

        price = float(
            data.get("price", 0)
        )

        discount = float(
            data.get("discount", 0)
        )

        rating = float(
            data.get("rating", 0)
        )

        review_count = int(
            data.get(
                "review_count",
                0
            )
        )

        stock = int(
            data.get("stock", 0)
        )

        old_price_value = data.get(
            "old_price"
        )

        old_price = (
            float(old_price_value)
            if old_price_value not in (
                None,
                ""
            )
            else None
        )

    except (
        TypeError,
        ValueError
    ):

        return error_response(
            "Invalid product values."
        )

    if price < 0 or stock < 0:
        return error_response(
            "Price and stock cannot be negative."
        )

    db = get_db()

    try:

        cursor = db.execute("""
            INSERT INTO products
            (
                name,
                description,
                category,
                price,
                old_price,
                discount,
                image,
                rating,
                review_count,
                stock,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name,
            description,
            category,
            price,
            old_price,
            discount,
            image,
            rating,
            review_count,
            stock,
            now()
        ))

        db.commit()

        product = db.execute(
            """
            SELECT *
            FROM products
            WHERE id = ?
            """,
            (cursor.lastrowid,)
        ).fetchone()

        return success_response(
            "Product created successfully.",
            {
                "product": dict(product)
            },
            201
        )

    finally:
        close_db(db)


# ============================================================
# ADMIN — DELETE PRODUCT
# ============================================================

@app.route(
    "/api/admin/products/<int:product_id>",
    methods=["DELETE"]
)
@admin_required
def admin_delete_product(
    user,
    product_id
):

    db = get_db()

    try:

        product = db.execute(
            """
            SELECT *
            FROM products
            WHERE id = ?
            """,
            (product_id,)
        ).fetchone()

        if not product:
            return error_response(
                "Product not found.",
                404
            )

        db.execute(
            """
            DELETE FROM products
            WHERE id = ?
            """,
            (product_id,)
        )

        db.commit()

        return success_response(
            "Product deleted successfully."
        )

    finally:
        close_db(db)


# ============================================================
# FRONTEND FILE SERVING
# ============================================================

@app.route(
    "/index.html",
    methods=["GET"]
)
def frontend_index():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )


@app.route(
    "/<path:filename>",
    methods=["GET"]
)
def frontend_files(filename):

    if filename.startswith("api/"):
        return error_response(
            "API endpoint not found.",
            404
        )

    return send_from_directory(
        FRONTEND_DIR,
        filename
    )


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return error_response(
        "Page or API endpoint not found.",
        404
    )


@app.errorhandler(405)
def method_not_allowed(error):

    return error_response(
        "HTTP method not allowed.",
        405
    )


@app.errorhandler(500)
def internal_error(error):

    app.logger.exception(error)

    return error_response(
        "An internal server error occurred.",
        500
    )


# ============================================================
# RETURNS & REFUNDS FRONTEND PAGE
# ============================================================

@app.route(
    "/return-refund.html",
    methods=["GET"]
)
@app.route(
    "/returns-refunds.html",
    methods=["GET"]
)
@app.route(
    "/returns.html",
    methods=["GET"]
)
@app.route(
    "/return.html",
    methods=["GET"]
)
@app.route(
    "/refund.html",
    methods=["GET"]
)
def returns_refunds_page():

    return send_from_directory(
        FRONTEND_DIR,
        "return-refund.html"
    )


# ============================================================
# SEED DEFAULT PRODUCTS
# ============================================================

def seed_products():

    conn = get_db()

    count = conn.execute(
        """
        SELECT COUNT(*) AS count
        FROM products
        """
    ).fetchone()["count"]

    if count > 0:
        conn.close()
        return

    products = [

        (
            "Wireless Bluetooth Speaker",
            "Portable wireless Bluetooth speaker with clear sound and strong battery life.",
            "Electronics",
            25000,
            30000,
            17,
            "speaker.jpg",
            4.5,
            24,
            20
        ),

        (
            "Smart Watch",
            "Modern smart watch with fitness tracking, notifications and everyday features.",
            "Electronics",
            18000,
            22000,
            18,
            "smartwatch.jpg",
            4.3,
            18,
            15
        ),

        (
            "Dinner Set",
            "Elegant dinner set suitable for everyday meals and special occasions.",
            "Home",
            25000,
            30000,
            17,
            "dinner-set.jpg",
            4.5,
            24,
            20
        ),

        (
            "Leather Handbag",
            "Premium-looking leather handbag designed for everyday use.",
            "Fashion",
            28000,
            35000,
            20,
            "handbag.jpg",
            4.6,
            19,
            18
        ),

        (
            "Decorative Throw Pillow",
            "Soft decorative throw pillow that adds comfort and style to your space.",
            "Home",
            12000,
            15000,
            20,
            "pillow.jpg",
            4.4,
            12,
            30
        )
    ]

    timestamp = datetime.now().isoformat()

    conn.executemany(
        """
        INSERT INTO products
        (
            name,
            description,
            category,
            price,
            old_price,
            discount,
            image,
            rating,
            review_count,
            stock,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (
                name,
                description,
                category,
                price,
                old_price,
                discount,
                image,
                rating,
                review_count,
                stock,
                timestamp
            )
            for
            name,
            description,
            category,
            price,
            old_price,
            discount,
            image,
            rating,
            review_count,
            stock
            in products
        ]
    )

    conn.commit()
    conn.close()


# ============================================================
# STARTUP
# ============================================================

init_database()
seed_products()


if __name__ == "__main__":

    print()

    print("=" * 60)
    print("CART E-COMMERCE BACKEND")
    print("=" * 60)

    print()

    print(
        f"Database: {DATABASE}"
    )

    print(
        f"Frontend: {FRONTEND_DIR}"
    )

    print(
        "API: https://cart-backend-8xew.onrender.com"
    )

    print(
        "Server is ready."
    )

    print(
        "=" * 60
    )

    print()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )