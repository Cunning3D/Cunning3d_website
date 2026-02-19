export async function loader() {
  return new Response(JSON.stringify({}), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
