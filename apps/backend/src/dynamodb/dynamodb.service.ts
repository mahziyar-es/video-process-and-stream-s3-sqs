import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoDBTables } from './dynamodb-tables.enum';

@Injectable()
export class DynamoDBService {
  constructor(private readonly dynamodbClient: DynamoDBClient) {}

  async getAllItemsFromTable(table: DynamoDBTables) {
    const command = new ScanCommand({
      TableName: table,
    });

    const response = await this.dynamodbClient.send(command);

    return response.Items;
  }

  async getItemFromTable(table: DynamoDBTables, key: Record<string, any>) {
    const command = new GetCommand({
      TableName: table,
      Key: key,
    });

    const response = await this.dynamodbClient.send(command);

    return response.Item;
  }

  async createItemInTable(table: DynamoDBTables, item: Record<string, any>) {
    const command = new PutCommand({
      TableName: table,
      Item: item,
    });

    const response = await this.dynamodbClient.send(command);

    return response;
  }

  async updateItemInTable(
    table: DynamoDBTables,
    key: Record<string, any>,
    updatedData: Record<string, any>,
  ) {
    const updateExpression = [];
    const updateExpressionValues = {};

    for (const [key, value] of Object.entries(updatedData)) {
      updateExpression.push(`${key} = :${key}`);
      updateExpressionValues[`:${key}`] = value;
    }

    const command = new UpdateCommand({
      TableName: table,
      Key: key,
      UpdateExpression: `set ${updateExpression.join(',')}`,
      ExpressionAttributeValues: updateExpressionValues,
      ReturnValues: 'ALL_NEW',
    });

    const response = await this.dynamodbClient.send(command);

    return response;
  }
}
