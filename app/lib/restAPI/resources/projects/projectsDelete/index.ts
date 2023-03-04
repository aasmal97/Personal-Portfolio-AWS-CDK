import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { deleteTemplate } from "../../../../../../utils/apiTemplates/deleteTemplate";
import { ProjectDocument } from "../../types/projectTypes";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
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
  const parsedKey = JSON.parse(key);
  const primaryKey: Record<string, any> = {
    ...parsedKey,
    recordType: "projects",
  };
  if (!primaryKey["dateCreated"])
    return {
      statusCode: 401,
      body: "Invalid primary key",
    };

  //delete record in dyanmo db table
  const result = await deleteTemplate({
    document: marshall(primaryKey as ProjectDocument["pk"]),
    tableName: "projects",
    successMessage: "deleted record from projects",
  });
  return result;
}

