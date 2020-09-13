import { Handler } from "aws-lambda";

export const handler: Handler = async (event: any) => {
  console.log("running imagga api request");
  console.log(event);
  return "Finished";
};
