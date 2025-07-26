import * as dynamoose from "dynamoose";

dynamoose.aws.ddb.local("https://localhost.localstack.cloud:4566");

const UsersSchema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      default: () => crypto.randomUUID(),
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: {
        name: "EmailIndex",
        rangeKey: "userId",
      },
    },
    password: {
      type: String,
      required: true,
    },
    summary: String,
    pageCount: Number,
  },
  {
    timestamps: true,
  }
);

const NotesSchema = new dynamoose.Schema(
  {
    noteId: {
      type: String,
      hashKey: true,
      default: () => crypto.randomUUID(),
    },
    userId: {
      type: String,
      required: true,
      index: {
        name: "UserIdIndex",
        rangeKey: "noteId",
      },
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    summary: String,
    pageCount: Number,
  },
  {
    timestamps: true,
  }
);

const Users = dynamoose.model("Users", UsersSchema);
const Notes = dynamoose.model("Notes", NotesSchema);

const initializeAws = async () => {};

export { initializeAws, Users, Notes };
