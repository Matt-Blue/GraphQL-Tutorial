const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:5000/companies/${parentValue._id}/users`)
                    .then(response => response.data);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args){
                return axios.get(`http://localhost:5000/companies/${parentValue.companyId}`)
                    .then(response => response.data);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { _id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:5000/users/${args._id}`)
                    .then(response => response.data);
            }
        },
        company: {
            type: CompanyType,
            args: { _id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios.get(`http://localhost:5000/companies/${args._id}`)
                    .then(response => response.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, { name, age }) {
                return axios.post('http://localhost:5000/users/', { name, age })
                    .then(response => response.data);
            }
        },
        editUser: {
            type: UserType,
            args: {
                _id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, args) {
                return axios.patch(`http://localhost:5000/users/${args._id}`, args)
                    .then(response => response.data);
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                _id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { _id }) {
                return axios.delete(`http://localhost:5000/users/${_id}`)
                    .then(response => response.data);
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});