export const isNameRepeated = async (
  typeCheck: "company" | "team",
  reqUser: any,
  newName: string
): Promise<boolean> => {
  try {
    if (typeCheck == "company") {
      const arrayModels: Array<any> = await reqUser.getCompanies({
        where: {
          name: newName
        }
      });

      return arrayModels.length != 0;
    } else {
      const arrayModels: Array<any> = await reqUser.getTeams({
        where: {
          name: newName
        }
      });

      return arrayModels.length != 0;
    }
  } catch (error) {
    console.log(error);
    return true; // Just to prevent update when error
  }
};
