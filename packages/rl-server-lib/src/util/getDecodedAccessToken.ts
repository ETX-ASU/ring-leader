import jwtDecode from "jwt-decode";

const getDecodedAccessToken = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (Error) {
    return null;
  }
};
export { getDecodedAccessToken };
