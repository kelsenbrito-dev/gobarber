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
            return usuarioService.login(email, password);
        },

        createUser: async (_, { data }, { usuarioService }) => {
            return usuarioService.createUser(data);
        },

        updateUser: async (_, { _id, data }, { user, usuarioService }) => {
            return usuarioService.updateUser(_id, data, user);
        },

        deleteUser: async (_, { _id }, { user, usuarioService }) => {
            return usuarioService.deleteUser(_id, user);
        },
    },
};