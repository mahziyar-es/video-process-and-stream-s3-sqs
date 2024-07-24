provider "aws" {

  access_key = "test"
  secret_key = "test"
  region     = "us-east-1"


  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3       = "http://s3.localhost.localstack.cloud:4566"
    sqs      = "http://localhost:4566"
    dynamodb = "http://localhost:4566"
  }
}


resource "aws_s3_bucket" "raw_videos_bucket" {
  bucket = "raw-videos-bucket"
}

resource "aws_s3_bucket" "processes_videos_bucket" {
  bucket = "processed-videos-bucket"
}

resource "aws_s3_bucket_public_access_block" "processes_videos_bucket_public_access_policy" {
  bucket = aws_s3_bucket.processes_videos_bucket.id

  block_public_acls   = false
  block_public_policy = false
}

resource "aws_sqs_queue" "queue" {
  name = "queue"
}

resource "aws_dynamodb_table" "videos" {
  name         = "videos"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "key"

  attribute {
    name = "key"
    type = "S"
  }
}
