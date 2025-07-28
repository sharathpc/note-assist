resource "aws_dynamodb_table" "ns_users_table" {
  name         = "Users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Name        = "Note Assist Users Table Dynamodb"
    Environment = "Development"
  }
}

resource "aws_dynamodb_table" "ns_notes_table" {
  name         = "Notes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "noteId"

  attribute {
    name = "noteId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "UserIdIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "Note Assist Notes Table Dynamodb"
    Environment = "Development"
  }
}
