export const createToken = (size: number): string => {
  try {
    let key: string = "";
    const possibleValues: string = "0123456789qwertyuiopasdfghjklzxcvbnm";

    for (var i = 0; i < size; i++) {
      const index = Math.round(Math.random() * (possibleValues.length - 1));
      key += possibleValues[index];
    }
    return key;
  } catch (error) {
    console.error(error);
    return "";
  }
};
