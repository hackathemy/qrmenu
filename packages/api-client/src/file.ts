export const submitFileToCDN = async (url: string, file: File) => {
  return await fetch(url, {
    method: "PUT",
    body: file,
  });
};
