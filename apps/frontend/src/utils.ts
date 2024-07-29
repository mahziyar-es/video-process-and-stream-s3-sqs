export const httpRequest = async (url: string, options?: RequestInit) => {
  const res = await fetch(`http://localhost:3001/${url}`, options);

  const data = await res.json();

  if (!res.ok) {
    console.log(res.status, JSON.stringify(data));
  }

  return data;
};
