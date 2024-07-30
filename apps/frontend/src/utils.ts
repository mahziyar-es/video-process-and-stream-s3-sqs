export const httpRequest = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${process.env.API_BASE_URL}/${url}`, options);

  const data = await res.json();

  if (!res.ok) {
    console.log(res.status, JSON.stringify(data));
  }

  return data;
};
