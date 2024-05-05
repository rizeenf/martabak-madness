export const useFetchServer = async (endpoint?: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${endpoint}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Error while fetch menus.");
  }

  return res.json();
};
