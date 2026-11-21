const Base = import.meta.env.VITE_API_URL;

export async function registerUser({ name, email, password }) {
  const data = await fetch(`${Base}/authentication/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then((res) => res.json());
  return data;
}

export async function validateUser({ name, password }) {
  const data = await fetch(`${Base}/authentication/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, password }),
  }).then((r) => r.json());
  return data;
}

export async function searchUser({ username, user_id }) {
  const data = await fetch(
    `${Base}/users/search?username=${encodeURIComponent(username)}&user_id=${user_id}`,
  );
  return await data.json();
}

export async function createConversations({ participant_id, created_by }) {
  const data = await fetch(`${Base}/conversations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ created_by, participant_id }),
  });
  return await data.json();
}

export async function getConversations(user_id) {
  const data = await fetch(`${Base}/conversations/${user_id}`);
  return data.json();
}

export async function getMessages(conversation_id) {
  const data = await fetch(`${Base}/messages/${conversation_id}`);
  return data.json();
}

export async function sendMessages({ conversation_id, sender_id, content }) {
  const data = await fetch(`${Base}/messages/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id,
      sender_id,
      content,
    }),
  });

  return data.json();
}
