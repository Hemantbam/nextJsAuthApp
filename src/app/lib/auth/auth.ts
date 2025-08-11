export async function login(email: string, password: string) {
  const response = await fetch("/api/users/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "User login failed");
  }

  return response.json();
}
