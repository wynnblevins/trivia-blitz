import axios from "axios"

export const retrieveToken = async (): Promise<any> => {
  const response = await axios.get('https://opentdb.com/api_token.php?command=request');
  return response.data.token;
}