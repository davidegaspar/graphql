const { ApolloServer, gql } = require('apollo-server');

const locationsTable = [
  {
    "id": 0,
    "name": "Shaft",
    "country": "North Dakota"
  },
  {
    "id": 1,
    "name": "Bodega",
    "country": "Northern Mariana Islands"
  },
  {
    "id": 2,
    "name": "Brooktrails",
    "country": "Florida"
  },
  {
    "id": 3,
    "name": "Chloride",
    "country": "Connecticut"
  },
  {
    "id": 4,
    "name": "Emerald",
    "country": "Washington"
  },
  {
    "id": 5,
    "name": "Longoria",
    "country": "New Hampshire"
  },
  {
    "id": 6,
    "name": "Cartwright",
    "country": "Mississippi"
  },
  {
    "id": 7,
    "name": "Terlingua",
    "country": "Arizona"
  },
  {
    "id": 8,
    "name": "Hickory",
    "country": "Michigan"
  },
  {
    "id": 9,
    "name": "Cliffside",
    "country": "Wisconsin"
  }
];

const flightsTable = [
  {
    "id": 0,
    "from": 1,
    "to": 2
  },
  {
    "id": 1,
    "from": 3,
    "to": 4
  },
  {
    "id": 2,
    "from": 4,
    "to": 5
  },
  {
    "id": 5,
    "from": 8,
    "to": 7
  }
];

const activitiesTable = [
  {
    "id": 0,
    name: "bouldering",
    prerequisites: [
      "18+",
      "climbing shoes",
    ],
    difficulty: 2,
    location: 1
  },
  {
    "id": 1,
    "name": "cooking 101",
    "prerequisites": [
      "5+",
      "apron",
      "woden spoon",
    ],
    "difficulty": 1,
    "location": 2
  }
];

const hotelsTable = [
  {
    id: 0,
    location: 1,
    activities: [0,1]
  },
  {
    id: 1,
    location: 2,
    activities: [1]
  }
]

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Location {
    id: ID!
    name: String
    country: String
  }

  type Flight {
    id: ID!
    from: Location
    to: Location
  }

  type Activity {
    id: ID!
    name: String
    prerequisites: [String]
    difficulty: Int
    location: Location
  }

  type Hotel {
    id: ID!
    location: Location
    activities: [Activity]
  }

  type Query {
    hotels: [Hotel]
    locations: [Location]
    flights: [Flight]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.

const getLocationById = (locations, id) => {
  return locations.find(location => location.id === Number(id))
}

const getActivities = (list, idList) => {
  console.log(list, idList);
  return list.filter(item => idList.indexOf(item.id) !== -1)
}

const resolvers = {
  Query: {
    hotels: (root, args, { hotelsTable }) => hotelsTable,
    locations: (root, args, { locationsTable }) => locationsTable,
    flights: (root, args, { flightsTable }) => flightsTable
  },
  Hotel: {
    location: ({ location }, _, { locationsTable }) => {
      return getLocationById(locationsTable, location)
    },
    activities: ({ activities }, _, { activitiesTable }) => {
      return getActivities(activitiesTable, activities)
    },
  },
  Activity: {
    location: ({ location }, _, { locationsTable }) => {
      return getLocationById(locationsTable, location)
    },
  }
};

const context = {
  locationsTable: locationsTable,
  flightsTable: flightsTable,
  activitiesTable: activitiesTable,
  hotelsTable: hotelsTable
}

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
