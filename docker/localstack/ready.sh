#!/bin/bash

awslocal s3api create-bucket --bucket raw-videos-bucket

awslocal s3api create-bucket --bucket processed-videos-bucket

awslocal s3api put-bucket-cors --bucket processed-videos-bucket --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET"],
      "AllowedOrigins": ["*"]
    }
  ]
}'

awslocal s3api put-bucket-policy --bucket processed-videos-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::processed-videos-bucket/*"
    }
  ]
}'


awslocal s3api create-bucket --bucket thumbnails-bucket

awslocal s3api put-bucket-policy --bucket thumbnails-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::thumbnails-bucket/*"
    }
  ]
}'



awslocal sqs create-queue --queue-name queue

awslocal dynamodb create-table --table-name videos --attribute-definitions '[{"AttributeName":"key", "AttributeType": "S"}]'  --key-schema '[{"AttributeName":"key", "KeyType": "HASH"}]' --billing-mode PAY_PER_REQUEST