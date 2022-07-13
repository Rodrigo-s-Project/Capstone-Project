export type DATA_GET_BUCKETS = {
  buckets: Array<any>
};

export const getAllBuckets = {
  url: (companyId: any, teamId: any) =>
    `${process.env.API_URL}/dashboard/drive/get-buckets/${companyId}/${teamId}`,
  method: "get"
};
