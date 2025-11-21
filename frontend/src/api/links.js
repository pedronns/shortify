const API = import.meta.env.VITE_API_URL;

async function postLink(data, endpoint) {
  const res = await fetch(`${API}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export const getLinkInfo = (code) =>
  fetch(`${API}/info/${code}`).then((r) => r.json());

export const createRandomLink = (data) => postLink(data, "random");
export const createCustomLink = (data) => postLink(data, "custom");
