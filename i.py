import bcrypt

# Function to generate a readable password of 64 characters
def create_readable_password(base_password):
    # Extend base password to 64 characters (you can repeat or append a pattern)
    return (base_password * (64 // len(base_password) + 1))[:64]

# Function to hash a password using bcrypt
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# List of base passwords (examples like "flower123", "Alice2025")
base_passwords = ["flower123", "Alice2025", "charliegrn", "brownDavid", "sunshine987"]

# Generate passwords and hash them
hashed_passwords = []
for base in base_passwords:
    readable_password = create_readable_password(base)
    hashed = hash_password(readable_password)
    hashed_passwords.append(hashed)

# Show the hashed passwords
for i, hashed in enumerate(hashed_passwords):
    print(f"Base Password: {base_passwords[i]}")
    print(f"Hashed Password: {hashed.decode('utf-8')}\n")
