import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { deleteTemplate } from "../../../../../../utils/apiTemplates/deleteTemplate";
// const convertToAttributeStr = (s: any) => ({
//   S: typeof s === "string" ? s : "",
// });
export async function handler(
  e: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  if (e.httpMethod !== "DELETE")
    return {
      statusCode: 405,
      body: "Wrong http request",
    };
  const params = e.queryStringParameters;
  if (!params)
    return {
      statusCode: 400,
      body: "You must provide the id of the resource you want to delete",
    };
  const { key } = params;
  if (!key)
    return {
      statusCode: 400,
      body: "You must provide the id of the resource you want to delete",
    };
  const document: Record<string, AttributeValue> = {
    key: JSON.parse(key),
  };
  try {
    const result = await deleteTemplate({
      document,
      tableName: "hobbies",
      successMessage: "deleted user image in hobbies",
    });
    return result;
  } catch (e) {
    return {
      statusCode: 500,
      body: "Bad Request",
    };
  }
}
