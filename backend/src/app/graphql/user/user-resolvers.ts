const USER_ADDED = 'USER_ADDED';

export default {
    Query: {
        users: (_, __, { user, usuarioService }) => {
            return usuarioService.users(user);
        },

        user: (_, { _id }, { user, usuarioService }) => {
            return usuarioService.user(_id, user)
        },
    },

    Mutation: {
        login: async (_, { email, password }, { usuarioService }) => {
            return await usuarioService.login(email, password);
        },

        createUser: async (_, { data }, { usuarioService, pubsub }) => {
            return await usuarioService.createUser(data, pubsub, USER_ADDED);
        },

        updateUser: async (_, { _id, data }, { user, usuarioService }) => {
            return usuarioService.updateUser(_id, data, user);
        },

        deleteUser: async (_, { _id }, { user, usuarioService }) => {
            return usuarioService.deleteUser(_id, user);
        },
    },

    Subscription: {
        userAdded: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator([USER_ADDED]),
        },
    }
};