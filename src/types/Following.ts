import { objectType } from "nexus";

export const Following = objectType({
  name: "Following",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("avatar");
    t.nonNull.int("followId");
    t.field("user", {
      type: "User",
      resolve: (parent, _, context) => {
        return context.prisma.following
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .user();
      },
    });
  },
});