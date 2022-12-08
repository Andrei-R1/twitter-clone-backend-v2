import { objectType } from "nexus";

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.field("createdAt", { type: "DateTime" });
    t.string("content");
    t.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.comment
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user();
      },
    });
    t.field("tweet", {
      type: "Tweet",
      resolve: (parent, _, context) => {
        return context.prisma.comment
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .tweet();
      },
    });
    t.field('comment', {
      type: 'Comment',
      resolve: (parent, _, context) => {
        return context.prisma.comment
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .comment();
      },
    });
  },
});