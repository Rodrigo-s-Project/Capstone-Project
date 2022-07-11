export type UPLOAD_IMAGE_DATA = {
  msg: string;
  success: boolean;
};

export const uploadImage = {
  url: `${process.env.CDN_URL}/files/upload`,
  method: "post"
};

export const getImage = {
  url: (filename: string) => `${process.env.CDN_URL}/files/image/${filename}`,
  method: "get"
};

export const deleteImage = {
  url: (filename: string) => `${process.env.CDN_URL}/files/image/${filename}`,
  method: "delete"
};
