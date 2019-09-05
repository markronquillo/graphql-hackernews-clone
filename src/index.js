const { GraphQLServer } = require("graphql-yoga");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: () => links[0]
  },
  Mutation: {
    post: (parent, args) => {
      const exist = links.filter(l => args.url === l.url);
      if (exist.length) {
        throw new Error("The given url is already in the list");
      }
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },

    update: (parent, args) => {
      let link = links.filter(l => args.id === l.id);

      if (!link.length) {
        throw new Error("Link does not exist");
      }

      link = {
        ...link[0],
        url: args.url ? args.url : l.url,
        description: args.description ? args.description : l.description
      };

      links = links.map(l => {
        if (args.id == l.id) {
          return link;
        }
        return l;
      });
      return link;
    },

    deleteLink: (parent, args) => {
      let link = links.filter(l => args.id === l.id);

      if (!link.length) {
        throw new Error("Link does not exist");
      }

      links = links.filter(l => {
        if (args.id == l.id) {
          return false;
        }
        return true;
      });

      return args.id;
    }
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
